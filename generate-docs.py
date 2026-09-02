import os

docs = {
    "PROJECT_ROUTES.md": """# Complete Route Inventory

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
""",

    "DATABASE_SCHEMA.sql": """-- DATABASE SCHEMA (Excluding Credentials/Secrets)

-- JOBS
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    organization TEXT,
    job_type TEXT,
    qualification TEXT,
    location TEXT,
    last_date DATE,
    description TEXT,
    apply_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREP EXAMS
CREATE TABLE prep_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, PUBLISHED
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prep_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES prep_exams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prep_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES prep_subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prep_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES prep_chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prep_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES prep_exams(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES prep_subjects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES prep_chapters(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES prep_topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
    explanation TEXT,
    difficulty TEXT DEFAULT 'MEDIUM',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MOCK TESTS
CREATE TABLE prep_mock_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES prep_exams(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    total_marks INTEGER NOT NULL,
    negative_marking NUMERIC(4,2) DEFAULT 0.0,
    instructions TEXT,
    status TEXT DEFAULT 'DRAFT', -- DRAFT, PUBLISHED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prep_mock_test_questions (
    test_id UUID REFERENCES prep_mock_tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES prep_questions(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    PRIMARY KEY (test_id, question_id)
);

-- SEARCH RPC (Phase 4)
-- FUNCTION: global_discovery_search(search_query text)
-- Returns JSON aggregating jobs, exams, topics, and mock tests using pg_trgm and to_tsvector.
""",

    "DATABASE_ARCHITECTURE.md": """# Database Architecture

## Hierarchical Syllabus Tree
The core of the preparation engine relies on a strict, cascading hierarchy:
`Exam -> Subject -> Chapter -> Topic -> Question`

By enforcing this structure via Foreign Keys (`ON DELETE CASCADE`), we ensure:
1. Data integrity (deleting an exam removes all related content).
2. Deep analytics (Mock Test results can trace a wrong answer back to the exact Topic and Chapter).

## Mock Test Linkage
Mock Tests sit parallel to the syllabus. They link an Exam to a specific set of Questions via a many-to-many join table (`prep_mock_test_questions`).
`Mock Test -> (M:M) -> Questions`

## Important Assumptions
- `jobs.id` is a `TEXT` string, while all `prep_*` tables use `UUID`. The Global Search RPC explicitly casts UUIDs to TEXT to allow a `UNION ALL`.
- `prep_questions.options` is stored as `JSONB` for flexibility, but `correct_answer` is strictly constrained via `CHECK (correct_answer IN ('A','B','C','D'))` to guarantee data cleanliness.
""",

    "SECURITY_ARCHITECTURE.md": """# Security Architecture

## 1. Admin Authentication
- **Mechanism:** HTTP-only secure cookie (`admin_token`).
- **Authorization:** Server Actions verify the JWT/token before executing *any* database mutation. Client-side state (`localStorage`) is strictly for UI rendering, not security.

## 2. Row Level Security (RLS)
- Supabase RLS is active. 
- Anonymous users have `SELECT` access to `jobs`, `prep_exams`, `prep_subjects`, `prep_chapters`, and `prep_topics`.
- **Protection:** Anonymous users do *not* have direct access to `prep_questions.correct_answer`.

## 3. Data Leak Prevention (Zero Trust)
- **Practice Engine (Phase 3) & Mock Engine (Phase 5):** The Next.js server explicitly drops the `correct_answer` and `explanation` from the payload before sending it to the client.
- The client must submit the answer to a Secure Server Action (`checkAnswer` or `submitMockTest`) to get grading.

## 4. Stateless Mock Sessions
- Phase 5 Mock Tests use a stateless HMAC SHA-256 JWT containing `expiresAt`. The timer cannot be spoofed by modifying local client time.

## 5. Secrets
- Secrets are stored in `.env.local` (e.g., `SUPABASE_SERVICE_ROLE_KEY`). The Service Role key is NEVER exposed to the browser.
""",

    "FEATURE_INVENTORY.md": """# Feature Inventory

- **Jobs Listing:** IMPLEMENTED
- **Job Details:** IMPLEMENTED
- **Exam Directory:** IMPLEMENTED
- **Exam Syllabus Dashboard:** IMPLEMENTED
- **Practice Engine (Topic Flashcards):** IMPLEMENTED (Phase 3)
- **Practice Progress Tracking (Local):** IMPLEMENTED
- **Global Search Engine:** IMPLEMENTED (Phase 4)
- **Cross-Content Discovery:** IMPLEMENTED
- **Search Autocomplete:** IMPLEMENTED
- **Mock Test Simulator:** IMPLEMENTED (Phase 5)
- **Mock Test Timer & Navigation:** IMPLEMENTED
- **Mock Test Server-side Analytics:** IMPLEMENTED
- **Job Bookmarks / Local Save:** IMPLEMENTED
- **Admin Panel Authentication:** IMPLEMENTED
- **Content Studio / CMS:** NOT IMPLEMENTED (Slated for Phase 6)
- **Study Materials / PDFs:** NOT IMPLEMENTED
""",

    "DESIGN_SYSTEM.md": """# Design System

- **Framework:** Tailwind CSS
- **Primary Color:** Indigo (`indigo-600` for primary actions)
- **Secondary Color:** Emerald (`emerald-600` for success/correct/submit)
- **Warning/Error:** Red (`red-600` for incorrect/penalty), Orange (`orange-500` for average performance)
- **Surfaces:** Clean Slate (`slate-50` backgrounds, `white` cards). Dark mode fully supported (`slate-950` backgrounds, `slate-900` cards).
- **Typography:** `font-black` for major headings, `font-bold` for interactive elements, `uppercase tracking-widest` for micro-labels (badges).
- **Philosophy:** "Clean, fast, rigorous". We actively removed excessive glassmorphism and gradients in Phase 2 in favour of a professional, "testing-center" aesthetic.
""",

    "PERFORMANCE_ARCHITECTURE.md": """# Performance Architecture

- **Next.js App Router:** Heavily utilizes Server Components.
- **Database Logic:** Most heavy lifting (like Global Search) is offloaded directly to PostgreSQL via RPC (`global_discovery_search`), eliminating N+1 queries in the Node.js layer.
- **Client Components:** Used strictly at the leaf nodes where interactivity is required (`MockTestEngine`, `PracticeEngineClient`, `SearchAutocomplete`).
- **Data Transfer:** Initial page loads send pure HTML. The `correct_answers` are intentionally stripped from payloads to reduce size and enforce security.
- **Caching:** Currently relying on Next.js default fetch caching; specific `revalidate` tags will be needed as the CMS (Phase 6) comes online.
""",

    "SEARCH_ARCHITECTURE.md": """# Search Architecture (Phase 4)

- **PostgreSQL RPC:** `global_discovery_search`
- **Mechanism:** Combines `to_tsvector` (Full Text Search) with `pg_trgm` (Trigram Similarity for typo tolerance).
- **Relevance Ranking:** Title matches are weighted 'A', descriptions 'C'. Exact matches mathematically dominate fuzzy matches.
- **URL State:** The entire UI is driven by `searchParams`. URLs like `?q=ADRE&type=JOB` are the single source of truth, making searches perfectly shareable.
- **Autocomplete:** Debounced (300ms) API call grouped by item type.
- **Typo Tolerance:** Implemented at the DB level, but strictly constrained to titles to prevent irrelevant fuzzy matches in long descriptions.
""",

    "KNOWN_ISSUES.md": """# Known Issues / Audit Flags

1. **Content Management (Phase 6):** The database supports the syllabus and mock tests, but there is currently no UI for Admins to easily upload questions in bulk or build tests visually. (Scheduled for Phase 6).
2. **Accessibility:** While contrast is good, many interactive `div`s lack proper `aria-labels` and keyboard focus trapping (especially in the Mobile Palette Drawer in Phase 5). REQUIRES VERIFICATION.
3. **SEO:** The site needs dynamic `sitemap.xml` generation for Exam Slugs and Job IDs. Currently, standard `generateMetadata` is used, but advanced Structured Data (JSON-LD) is missing.
4. **Data Sync:** Currently 100% local-first (anonymous). If users clear `localStorage`, they lose their mock test analytics history.
""",

    "USER_FLOWS.md": """# User Flows

## Core Journey: The Preparation Loop
1. **Discover:** User searches "Assam Police" in the Navbar Autocomplete.
2. **Navigate:** They see the cross-content layout, clicking on the "Assam Police Constable Exam".
3. **Study:** They view the Syllabus Dashboard, clicking "Mathematics -> Percentage".
4. **Practice (Phase 3):** They enter the Practice Engine, answering flashcard questions with instant feedback.
5. **Test (Phase 5):** They navigate to the Mock Test, taking a strict 120-minute timed exam.
6. **Analyze:** They submit, and the Analytics Engine identifies "Assam History" as their weakest topic (40%).
7. **Improve:** They click the "Practice" button next to Assam History, looping back to step 4.
"""
}

for filename, content in docs.items():
    with open(f"audit_package/{filename}", "w", encoding="utf-8") as f:
        f.write(content)

print("Documentation generated successfully.")
