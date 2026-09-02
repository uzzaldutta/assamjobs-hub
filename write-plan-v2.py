code = """
# Production Ingestion Engine Implementation Plan

## Goal Description
Enhance the Universal Content Ingestion Engine with production-ready real-world adapters (e.g., APSC, DHS Assam, AssamCareer), implement Canonical Record mapping (merging multiple sources into one verified truth), and add deep Change Detection (Old vs New value comparisons).

> [!IMPORTANT]
> **User Review Required**: Adding Canonical Record provenance and deep Change Detection requires slightly modifying the public `jobs` table schema to store source arrays and verification statuses. Please review the proposed schema changes before execution.

## Open Questions
> [!WARNING]
> Should we alter the existing `jobs` table to hold `discovered_sources` and `verification_status`, or create a separate `job_provenance` table to avoid risking the public feed's stability? (I am proposing altering `jobs` with safe, nullable columns to keep queries fast).

## Proposed Changes

### 1. Schema Upgrades (Canonical Provenance & Change Detection)
#### [MODIFY] `ingestion_sources` table
Add production fields:
- `tier` (INT): 1 = Official, 2 = Secondary
- `is_official` (BOOLEAN)
- `feed_type` (TEXT): The primary domain it serves.

#### [MODIFY] `jobs` table
Add provenance fields to support multiple sources without duplicating the public record:
- `verification_status` (TEXT) - 'VERIFIED' | 'VERIFICATION_PENDING'
- `official_source_url` (TEXT)
- `discovered_sources` (JSONB) - Array of { source_name, url, seen_at }
- `first_seen_at` (TIMESTAMPTZ)

#### [MODIFY] `ingestion_queue` table
- `change_diff` (JSONB) - Stores `[ { field, old_value, new_value } ]` for `CHANGE_DETECTED` status items.

### 2. Real-World Source Adapters
#### [NEW] `src/lib/ingestion/adapters/APSCAdapter.ts`
Tier 1 (Official) adapter targeting Assam Public Service Commission recruitment notices. Implements strict `fetch()` with DOM parsing.

#### [NEW] `src/lib/ingestion/adapters/AssamCareerAdapter.ts`
Tier 2 (Secondary) adapter. Built primarily for DISCOVERY. Items discovered here will be flagged as `VERIFICATION_PENDING` unless an official URL is provided.

### 3. Pipeline Enhancements (`pipeline.ts`)
#### [MODIFY] `src/lib/ingestion/pipeline.ts`
- **Canonical Merging**: If an adapter finds a job that matches an existing public `job`, but has a new source URL, it generates an `UPDATED` (Provenance) queue item rather than a Duplicate.
- **Change Detection**: If the scraped deadline, vacancy, or PDF link differs from the live canonical record, the pipeline sets status to `CHANGE_DETECTED` and populates `change_diff`.

### 4. Admin UI Upgrades
#### [MODIFY] `src/app/admin/studio/ingestion/page.tsx`
Update the Source Registry to display Tier, Official status, and specific feed types. Add "Enable/Disable" toggles.

#### [MODIFY] `src/app/admin/studio/ingestion/queue/page.tsx`
Add a specialized "Diff Viewer" component for items marked `CHANGE_DETECTED`. It will render a side-by-side (Old Value vs New Value) comparison. Add "Merge Duplicate" and "Approve Update" action buttons.

## Verification Plan
### Automated Tests
- Run `npx tsc --noEmit` to ensure pipeline interfaces remain strictly typed.

### Manual Verification
1. Run the `AssamCareerAdapter` -> verify items land in Queue as `NEW` (VERIFICATION_PENDING).
2. Run the `APSCAdapter` for the same job -> verify it detects the overlap, marks it `CHANGE_DETECTED` or Canonical, and sets `VERIFIED`.
3. Approve the update -> verify the public `jobs` table lists multiple `discovered_sources` but only ONE actual public card.
"""
with open("implementation_plan.md", "w", encoding="utf-8") as f:
    f.write(code)
