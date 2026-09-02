# PHASE 6: Content Studio & Quality Control Implementation Plan

## Goal
Build a best-in-class, scalable Content Studio within the Admin Panel to manage tens of thousands of competitive-exam questions, previous-year papers (PYQs), study materials, and mock tests. The focus is on quality control, bulk operations, duplicate detection, and gap analysis, all while strictly preserving the performance and security of Phases 1-5.

## ⚠️ User Review Required: Database Schema Changes

To support the advanced workflow states and new content types, we must safely expand the database. **These changes will not break existing tables.**

### 1. `prep_questions` Alteration
We will add the following columns to support the content lifecycle and advanced filtering:
- `status` (TEXT) DEFAULT 'DRAFT' (Enum: DRAFT, REVIEW, APPROVED, PUBLISHED, ARCHIVED)
- `source` (TEXT) - e.g., "APSC CCE 2023"
- `year` (INTEGER)
- `tags` (TEXT[]) - e.g., ["hard", "trick-question"]

### 2. New Table: `prep_materials`
A unified resource manager to prevent table bloat.
- `id` (UUID)
- `type` (TEXT) - Enum: BOOK, PDF, NOTE, PYQ, SYLLABUS, PRACTICE_SET
- `title` (TEXT)
- `description` (TEXT)
- `exam_id`, `subject_id`, `topic_id` (UUID, Foreign Keys)
- `file_url` (TEXT)
- `cover_url` (TEXT)
- `status` (TEXT) DEFAULT 'DRAFT'
- `metadata` (JSONB) - For PYQ-specific fields like `shift`, `duration`, `total_questions`.
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 3. New RPCs
- **`find_question_duplicates(query text, threshold float)`**: Uses `pg_trgm` similarity to warn admins about visually similar questions during manual entry and bulk import.
- **`get_content_gaps()`**: Aggregates `prep_topics` against `prep_questions` to highlight topics with zero or low question counts.

## Proposed Application Routes

We will modularize the Admin Panel (currently a massive `page.tsx`) by creating a dedicated `/admin/studio` workspace:

1. **/admin/studio** (Analytics & Gaps)
   - High-level charts, counts, and the "Content Gap" identification dashboard.
2. **/admin/studio/questions** (Question Bank)
   - Advanced paginated data table. Filters by status, exam, difficulty. Bulk actions (Approve, Archive).
3. **/admin/studio/questions/import** (Bulk Import Workflow)
   - Client-side CSV parsing → Validation → Table Preview with Error Highlighting → Server Action batch insert.
4. **/admin/studio/materials** (PYQs, Books, PDFs)
   - Manager for unified resources.
5. **/admin/studio/mock-tests** (Builder 2.0)
   - **Manual Mode:** Checkbox selection of questions.
   - **Auto Mode:** Form specifying distributions (e.g., 20% Hard, 25 Math). Generates a Draft test for review.
6. **/admin/studio/review** (Quality Control)
   - Pre-built filters: "Missing Explanations", "Potential Duplicates", "Unused Questions".

## Security & Architecture Rules
- All new Server Actions will rigorously enforce the existing `admin_token` JWT cookie.
- No correct answers will be leaked in the Analytics or Review dashboards to non-admin contexts.
- **Pagination First:** The Question Bank will strictly use `.limit()` and `.range()` to ensure it stays fast even at 100,000+ questions. No N+1 queries.

## Verification Plan
1. Deploy DB schema alterations via a Supabase migration script.
2. Build UI modules incrementally.
3. Test a 500-row CSV bulk import with intentionally broken rows to verify the Error Highlighting UI.
4. Verify that public routes (Phase 3 Practice, Phase 5 Mock Tests) continue functioning perfectly.
