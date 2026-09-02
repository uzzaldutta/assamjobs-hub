code = """
# Feed Ecosystem Expansion & Hardening Implementation Plan

## 1. CURRENT STATE
Currently, all content types (Tenders, Admissions, Results, Admit Cards) are jammed into the monolithic `jobs` table. For example, `/tenders/page.tsx` fetches `jobs` where `job_type = 'TENDER'`, and hacks fields like `vacancies` or `last_date` to fit the UI. Deduplication is handled on-the-fly via a generic `deduplicateJobs` function instead of leveraging the new Universal Ingestion provenance system.

## 2. GAPS FOUND
- **Data Model Mismatch:** Forcing Tenders, Results, and Admissions into the `jobs` schema loses critical data (e.g., Tender Value, EMD, Course Name, Exam Result Date).
- **Hardcoded Fallbacks:** Pages are heavily relying on hardcoded fallback arrays when data is missing, instead of utilizing clean empty states.
- **Client-side Filtering:** Feeds are fetching large datasets and filtering/deduplicating them on the server/client boundary rather than purely in the database.
- **Generic Cards:** The UI uses generic cards that don't immediately answer feed-specific questions (e.g., "What is the Tender Estimated Value?").

## 3. PROPOSED CHANGES
1. **Schema Segregation:** We will break out Tenders, Admissions, Results, and Scholarships into their own dedicated database tables, optimized for their specific fields.
2. **Dedicated UI Components:** Build `TenderCard`, `AdmissionCard`, `ResultCard`, etc., implementing the "What is this? Who is it for? When is the deadline?" UX principle.
3. **Ingestion Engine Routing:** Update the Admin `approveQueueItemAction` to cleanly route the JSON payloads into their respective new tables rather than forcing everything into `jobs`.
4. **URL-based Server Filters:** Implement robust `?search=...&type=...` server-side search params for each feed, replacing client-side `.filter()`.

## 4. DATABASE CHANGES REQUIRED
Create the following highly-indexed tables with RLS enabled:
- `tenders` (tender_number, department, value, emd, opening_date, closing_date, document_url, etc.)
- `admissions` (institution, course, eligibility, entrance_exam_date, start_date, end_date, etc.)
- `results` (exam_name, organization, result_type, result_date, result_url, etc.)

## 5. FILES TO MODIFY
- `src/app/tenders/page.tsx`
- `src/app/admissions/page.tsx`
- `src/app/results/page.tsx`
- `src/app/admin/studio/ingestion/actions.ts` (Routing logic)
- `src/lib/search/globalSearch.ts` (Updating the Global Search RPC to aggregate the new tables)

## 6. NEW FILES REQUIRED
- `src/components/feeds/TenderCard.tsx`
- `src/components/feeds/AdmissionCard.tsx`
- `src/components/feeds/ResultCard.tsx`
- `src/components/feeds/FeedFilterSidebar.tsx`

## 7. RISK ASSESSMENT
**Medium.** Splitting the `jobs` table into multiple tables means the Global Search Engine needs to be updated to `UNION` these tables. If not done carefully, global search could temporarily miss non-job items.

## 8. PERFORMANCE IMPACT
**Positive.** By segregating the data, table scans become faster. Implementing URL-based query parameters allows Supabase to handle filtering at the database layer (via `limit` and `range`), entirely eliminating the payload bloat of sending arrays to the client.

## 9. SECURITY IMPACT
**Neutral/Safe.** The new tables will mirror the exact same Row Level Security (RLS) and verification status rules as the `jobs` table. Ingestion remains locked behind `admin_token`.

## 10. IMPLEMENTATION ORDER
1. Generate and execute the SQL schema for `tenders`, `admissions`, and `results`.
2. Update the Global Search RPC to union the new tables safely.
3. Build the feed-specific `Card` UI components.
4. Rewrite the Feed Pages (`/tenders`, etc.) to use server-side pagination and the new tables.
5. Update `actions.ts` to route approved Ingestion items to the correct tables.
"""
with open("implementation_plan.md", "w", encoding="utf-8") as f:
    f.write(code)
