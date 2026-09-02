-- PHASE 6: Content Studio & Quality Control Schema Upgrade

-- 1. Upgrading prep_questions
-- We use TEXT with a CHECK constraint instead of ENUM for easier migrations.
ALTER TABLE prep_questions
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')),
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 2. Unified Materials Table (Books, PDFs, Notes, PYQs)
CREATE TABLE IF NOT EXISTS prep_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('BOOK', 'PDF', 'NOTE', 'PYQ', 'SYLLABUS', 'PRACTICE_SET')),
    title TEXT NOT NULL,
    description TEXT,
    exam_id UUID REFERENCES prep_exams(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES prep_subjects(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES prep_topics(id) ON DELETE CASCADE,
    file_url TEXT,
    cover_url TEXT,
    author TEXT,
    year INTEGER,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED')),
    metadata JSONB DEFAULT '{}'::jsonb, -- Store PYQ shift, duration, total_questions here
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on prep_materials
ALTER TABLE prep_materials ENABLE ROW LEVEL SECURITY;

-- Public read policy for published materials
CREATE POLICY "Public can view published materials" 
ON prep_materials FOR SELECT 
USING (status = 'PUBLISHED');

-- 3. Advanced RPC: Find Question Duplicates using pg_trgm
-- Warning: Ensure pg_trgm extension is created (already done in Phase 4)
CREATE OR REPLACE FUNCTION find_question_duplicates(
    p_question_text TEXT,
    p_similarity_threshold FLOAT DEFAULT 0.6
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    exam_id UUID,
    similarity_score FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id,
        q.question_text,
        q.exam_id,
        similarity(q.question_text, p_question_text)::FLOAT AS similarity_score
    FROM prep_questions q
    WHERE similarity(q.question_text, p_question_text) > p_similarity_threshold
    ORDER BY similarity_score DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Advanced RPC: Content Gap Analytics
-- Identifies topics that have 0 or very few PUBLISHED questions
CREATE OR REPLACE FUNCTION get_content_gaps(
    p_min_questions INT DEFAULT 5
)
RETURNS TABLE (
    exam_title TEXT,
    subject_title TEXT,
    chapter_title TEXT,
    topic_id UUID,
    topic_title TEXT,
    published_count BIGINT,
    draft_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.title AS exam_title,
        s.title AS subject_title,
        c.title AS chapter_title,
        t.id AS topic_id,
        t.title AS topic_title,
        COUNT(q.id) FILTER (WHERE q.status = 'PUBLISHED') AS published_count,
        COUNT(q.id) FILTER (WHERE q.status != 'PUBLISHED') AS draft_count
    FROM prep_topics t
    JOIN prep_chapters c ON t.chapter_id = c.id
    JOIN prep_subjects s ON c.subject_id = s.id
    JOIN prep_exams e ON s.exam_id = e.id
    LEFT JOIN prep_questions q ON q.topic_id = t.id
    GROUP BY e.title, s.title, c.title, t.id, t.title
    HAVING COUNT(q.id) FILTER (WHERE q.status = 'PUBLISHED') < p_min_questions
    ORDER BY published_count ASC, e.title ASC, s.title ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

