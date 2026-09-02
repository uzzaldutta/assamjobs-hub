# Complete Route Inventory

## `/` (Homepage)
- **Purpose:** Main landing page for AssamJobs Hub.
- **Type:** Server Component.
- **Authentication:** None.
- **Data:** `jobs` table (recent jobs), `prep_exams` (popular exams).
- **Status:** IMPLEMENTED.
- **Limitations:** Currently static trending queries; could use analytics later.

## `/jobs` and `/jobs/[id]`
- **Purpose:** Job listing and details.
- **Type:** Server Component (listing), Server Component (details).
- **Authentication:** None.
- **Data:** `jobs` table.
- **Status:** IMPLEMENTED.

## `/exams` and `/exam/[slug]`
- **Purpose:** Exam Directory and specific Exam Syllabus Dashboard.
- **Type:** Server Components.
- **Authentication:** None.
- **Data:** `prep_exams`, `prep_subjects`, `prep_chapters`, `prep_topics`.
- **Status:** IMPLEMENTED.

## `/practice/[topicId]`
- **Purpose:** Instant-feedback flashcard practice engine.
- **Type:** Server Component wrapper -> Client Component (`PracticeEngineClient`).
- **Authentication:** None (Local-first).
- **Data:** `prep_questions` (via secure Server Action `getSecureQuestion`).
- **Status:** IMPLEMENTED (Phase 3).
- **Limitations:** Only supports 4-option MCQs.

## `/mock-test/[testId]`
- **Purpose:** High-stakes exam simulator & analytics engine.
- **Type:** Server Component wrapper -> Client Component (`MockTestEngine`).
- **Authentication:** None (Stateless JWT via Server Actions).
- **Data:** `prep_mock_tests`, `prep_mock_test_questions`, `prep_questions`.
- **Status:** IMPLEMENTED (Phase 5).

## `/search`
- **Purpose:** Global Discovery Engine (Jobs + Exams + Practice).
- **Type:** Server Component -> Client Component (`SearchClient`).
- **Authentication:** None.
- **Data:** `jobs`, `prep_exams`, `prep_topics`, `prep_mock_tests` (via `global_discovery_search` RPC).
- **Status:** IMPLEMENTED (Phase 4).

## `/admin/*`
- **Purpose:** Platform management.
- **Type:** Server & Client Components.
- **Authentication:** REQUIRED (Secure HTTP-only cookie).
- **Status:** PARTIAL (Database structure exists, but Phase 6 Content Management UI is missing).
