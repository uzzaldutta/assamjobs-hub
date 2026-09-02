-- DATABASE SCHEMA (Excluding Credentials/Secrets)

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
