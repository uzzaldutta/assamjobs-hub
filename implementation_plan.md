
# Ingestion Engine Implementation Plan

## Goal Description
Transform the existing isolated scraper endpoints (Adzuna, NFR) into a robust, extensible Automated Content Ingestion Engine. This engine will provide automated discovery, strong validation, intelligent duplicate/change detection, human oversight via a Review Queue, and standardized output for Jobs, Tenders, Admissions, Results, and Admit Cards.

> [!IMPORTANT]
> **User Review Required**: This is a major architectural change. Please review the proposed database schemas and adapter architecture before we proceed to coding.

## Open Questions
> [!WARNING]
> Do we want to deprecate the existing direct-to-`jobs` sync immediately upon launching this new system, or run them in parallel until the new review queue is fully populated and tested? (I will assume we build the new queue alongside the old tables, and redirect the cron to the new queue).

## Proposed Changes

### 1. Database Schema Additions (Ingestion Engine)
We will introduce three core tables to track sources, logs, and the ingestion review queue.

#### [NEW] `ingestion_sources`
Tracks trusted targets and their metadata.
- `id` (UUID)
- `name` (TEXT) - e.g. "DHS Assam", "Adzuna"
- `url` (TEXT)
- `adapter_name` (TEXT) - e.g. "DHSAssamAdapter", "AdzunaAdapter"
- `category` (TEXT) - Default category to apply
- `priority` (INT) - High, Normal, Low
- `status` (TEXT) - ACTIVE, DISABLED
- `last_run_at` (TIMESTAMPTZ)
- `last_success_at` (TIMESTAMPTZ)

#### [NEW] `ingestion_runs`
Observability log for every fetch attempt.
- `id` (UUID)
- `source_id` (UUID)
- `status` (TEXT) - SUCCESS, FAILED
- `records_found` (INT)
- `records_processed` (INT)
- `duplicates_found` (INT)
- `error_message` (TEXT)

#### [NEW] `ingestion_queue`
The staging table holding extracted content before Admin approval.
- `id` (UUID)
- `source_id` (UUID)
- `content_hash` (TEXT) - Unique constraint
- `title` (TEXT)
- `organization` (TEXT)
- `category` (TEXT) - JOB, TENDER, ADMISSION, RESULT, ADMIT_CARD
- `payload` (JSONB) - The normalized extracted data
- `quality_score` (INT) - 0-100 based on completeness
- `duplicate_risk` (TEXT) - NONE, POSSIBLE, EXACT
- `duplicate_of_id` (UUID) - If matched to existing record
- `status` (TEXT) - NEW, UPDATED, APPROVED, REJECTED
- `created_at` (TIMESTAMPTZ)

---

### 2. Adapter Architecture

#### [NEW] `src/lib/ingestion/BaseAdapter.ts`
Defines the `SourceAdapter` interface:
```typescript
interface SourceAdapter {
  discover(): Promise<RawContent[]>;
  extract(raw: RawContent): ExtractedData;
  normalize(data: ExtractedData): NormalizedPayload;
  validate(payload: NormalizedPayload): boolean;
}
```

#### [NEW] `src/lib/ingestion/adapters/AdzunaAdapter.ts`
Refactors `src/lib/adzuna.ts` to implement `SourceAdapter`, sending results to `ingestion_queue` instead of directly to `jobs`.

#### [NEW] `src/lib/ingestion/adapters/NFRAdapter.ts`
Refactors `scrape-nfr` into the new architecture.

#### [NEW] `src/lib/ingestion/pipeline.ts`
The core engine that runs adapters, performs Duplicate Detection (`pg_trgm` matching + hash comparison), Change Detection, calculates Quality Scores, and inserts into `ingestion_queue`.

---

### 3. Admin Ingestion Dashboard

#### [NEW] `src/app/admin/studio/ingestion/page.tsx`
Dashboard listing all sources (`ingestion_sources`), their last run statuses, and buttons to "Run Now" or "View Logs".

#### [NEW] `src/app/admin/studio/ingestion/queue/page.tsx`
The central Review Workspace. Admins will see cards marked **NEW**, **UPDATED**, or **DUPLICATE RISK**.
Actions:
- `Approve`: Moves data from `payload` to the live `jobs` (or respective) table, marking status as APPROVED.
- `Reject`: Marks as REJECTED.

#### [MODIFY] `src/app/admin/studio/layout.tsx`
Add links to the "Ingestion Engine" and "Review Queue".

## Verification Plan
### Automated Tests
- `npx tsc --noEmit` to ensure the new Adapter interfaces are strictly typed.
- SQL syntax validation for new table schemas.

### Manual Verification
1. Open Admin Dashboard -> Ingestion Engine.
2. Manually trigger the Adzuna and NFR adapters.
3. Verify that new records land in the Review Queue instead of immediately polluting the public Job Feed.
4. Verify Quality Scores calculate correctly (e.g. missing dates drops the score).
5. Approve a job and verify it successfully routes to the public `jobs` table.
