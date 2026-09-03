code = """
-- PHASE 6.x MASTER MIGRATION FILE
-- This file contains all schema changes required for the Universal Ingestion Engine & Feed Ecosystem.

-- 1. INGESTION TABLES

CREATE TABLE IF NOT EXISTS ingestion_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    adapter_name TEXT NOT NULL,
    tier INT DEFAULT 2,
    is_official BOOLEAN DEFAULT false,
    feed_type TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES ingestion_sources(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status TEXT DEFAULT 'RUNNING',
    items_discovered INT DEFAULT 0,
    items_extracted INT DEFAULT 0,
    items_validated INT DEFAULT 0,
    items_new INT DEFAULT 0,
    items_duplicate INT DEFAULT 0,
    items_changed INT DEFAULT 0,
    items_rejected INT DEFAULT 0,
    items_missing_link INT DEFAULT 0,
    items_invalid_link INT DEFAULT 0,
    items_low_quality INT DEFAULT 0,
    warnings_encountered INT DEFAULT 0,
    duplicates_found INT DEFAULT 0,
    errors_encountered INT DEFAULT 0,
    run_log TEXT
);

CREATE TABLE IF NOT EXISTS ingestion_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES ingestion_sources(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL,
    external_id TEXT,
    source_url TEXT NOT NULL,
    title TEXT NOT NULL,
    normalized_payload JSONB NOT NULL,
    raw_payload JSONB,
    content_hash TEXT NOT NULL,
    status TEXT DEFAULT 'NEW',
    quality_score INT DEFAULT 0,
    duplicate_score FLOAT DEFAULT 0,
    duplicate_of UUID,
    change_diff JSONB,
    validation_errors JSONB DEFAULT '[]'::jsonb,
    validation_warnings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS job_provenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_id UUID NOT NULL,
    content_type TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_tier INT DEFAULT 2,
    is_official BOOLEAN DEFAULT false,
    content_hash TEXT NOT NULL,
    discovered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NEW FEED TABLES

CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    department TEXT,
    tender_number TEXT,
    estimated_value TEXT,
    closing_date DATE,
    official_source_url TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    course TEXT,
    application_deadline DATE,
    application_link TEXT,
    official_source_url TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    exam_name TEXT,
    result_date DATE,
    result_url TEXT,
    official_source_url TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    exam_name TEXT,
    exam_date DATE,
    release_date DATE,
    download_url TEXT,
    notification_url TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    official_source_url TEXT,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    scheme TEXT,
    eligibility TEXT,
    amount TEXT,
    application_start DATE,
    application_deadline DATE,
    application_url TEXT,
    notification_url TEXT,
    status TEXT DEFAULT 'PUBLISHED',
    official_source_url TEXT,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES

ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE admit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published tenders" ON tenders FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published admissions" ON admissions FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published results" ON results FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published admit cards" ON admit_cards FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published scholarships" ON scholarships FOR SELECT USING (status = 'PUBLISHED');

-- 4. MODIFY EXISTING TABLES SAFELY (Adding missing columns if needed without breaking existing data)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'VERIFICATION_PENDING';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS official_source_url TEXT;

ALTER TABLE prep_exams ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PUBLISHED';

-- Enable pg_trgm for text search if not exists
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 5. GLOBAL SEARCH RPC
CREATE OR REPLACE FUNCTION global_discovery_search(
  search_query TEXT,
  limit_val INT DEFAULT 20,
  offset_val INT DEFAULT 0
)
RETURNS TABLE (
  item_id TEXT,
  item_type TEXT,
  title TEXT,
  subtitle TEXT,
  metadata JSONB,
  relevance_score FLOAT,
  total_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  formatted_query TEXT;
BEGIN
  IF NULLIF(trim(search_query), '') IS NULL THEN
     RETURN;
  END IF;

  formatted_query := plainto_tsquery('english', search_query)::text;

  RETURN QUERY
  WITH unified_results AS (
      SELECT j.id::TEXT AS item_id, 'JOB'::TEXT AS item_type, j.title::TEXT AS title, j.organization::TEXT AS subtitle,
        jsonb_build_object('qualification', j.qualification, 'location', j.district, 'job_type', j.job_type, 'last_date', j.last_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(j.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(j.title, search_query))::FLOAT AS relevance_score
      FROM jobs j WHERE j.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(j.title, '')) @@ to_tsquery('english', formatted_query) OR j.title % search_query)
      UNION ALL
      SELECT t.id::TEXT AS item_id, 'TENDER'::TEXT AS item_type, t.title::TEXT AS title, t.organization::TEXT AS subtitle,
        jsonb_build_object('tender_number', t.tender_number, 'estimated_value', t.estimated_value, 'closing_date', t.closing_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(t.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(t.title, search_query))::FLOAT AS relevance_score
      FROM tenders t WHERE t.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(t.title, '')) @@ to_tsquery('english', formatted_query) OR t.title % search_query)
      UNION ALL
      SELECT a.id::TEXT AS item_id, 'ADMISSION'::TEXT AS item_type, a.title::TEXT AS title, a.institution::TEXT AS subtitle,
        jsonb_build_object('course', a.course, 'application_deadline', a.application_deadline) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(a.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(a.title, search_query))::FLOAT AS relevance_score
      FROM admissions a WHERE a.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(a.title, '')) @@ to_tsquery('english', formatted_query) OR a.title % search_query)
      UNION ALL
      SELECT r.id::TEXT AS item_id, 'RESULT'::TEXT AS item_type, r.title::TEXT AS title, r.organization::TEXT AS subtitle,
        jsonb_build_object('exam_name', r.exam_name, 'result_date', r.result_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(r.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(r.title, search_query))::FLOAT AS relevance_score
      FROM results r WHERE r.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(r.title, '')) @@ to_tsquery('english', formatted_query) OR r.title % search_query)
      UNION ALL
      SELECT ac.id::TEXT AS item_id, 'ADMIT_CARD'::TEXT AS item_type, ac.title::TEXT AS title, ac.organization::TEXT AS subtitle,
        jsonb_build_object('exam_name', ac.exam_name, 'exam_date', ac.exam_date, 'release_date', ac.release_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(ac.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(ac.title, search_query))::FLOAT AS relevance_score
      FROM admit_cards ac WHERE ac.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(ac.title, '')) @@ to_tsquery('english', formatted_query) OR ac.title % search_query)
      UNION ALL
      SELECT s.id::TEXT AS item_id, 'SCHOLARSHIP'::TEXT AS item_type, s.title::TEXT AS title, s.organization::TEXT AS subtitle,
        jsonb_build_object('scheme', s.scheme, 'amount', s.amount, 'application_deadline', s.application_deadline) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(s.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(s.title, search_query))::FLOAT AS relevance_score
      FROM scholarships s WHERE s.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(s.title, '')) @@ to_tsquery('english', formatted_query) OR s.title % search_query)
      UNION ALL
      SELECT e.id::TEXT AS item_id, 'EXAM'::TEXT AS item_type, e.title::TEXT AS title, 'Competitive Exam'::TEXT AS subtitle,
        jsonb_build_object('slug', e.slug, 'description', e.description) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(e.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.5 + similarity(e.title, search_query) * 1.5)::FLOAT AS relevance_score
      FROM prep_exams e WHERE e.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(e.title, '')) @@ to_tsquery('english', formatted_query) OR e.title % search_query)
  )
  SELECT u.*, (SELECT COUNT(*) FROM unified_results) AS total_count
  FROM unified_results u ORDER BY u.relevance_score DESC OFFSET offset_val LIMIT limit_val;
END;
$$;

-- 6. DUPLICATE DETECTION RPC
CREATE OR REPLACE FUNCTION check_job_duplicates(
  p_title TEXT,
  p_organization TEXT,
  p_apply_url TEXT
)
RETURNS TABLE (
  id UUID,
  similarity_score FLOAT,
  match_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    (similarity(j.title, p_title) * 0.7 + similarity(COALESCE(j.organization, ''), COALESCE(p_organization, '')) * 0.3)::FLOAT as similarity_score,
    CASE 
      WHEN j.apply_url = p_apply_url AND p_apply_url IS NOT NULL THEN 'EXACT_URL'
      ELSE 'FUZZY_MATCH'
    END as match_type
  FROM jobs j
  WHERE 
    (j.apply_url = p_apply_url AND p_apply_url IS NOT NULL) OR
    (similarity(j.title, p_title) > 0.4)
  ORDER BY similarity_score DESC
  LIMIT 5;
END;
$$;
"""
with open("MASTER_PHASE_6_MIGRATION.sql", "w", encoding="utf-8") as f:
    f.write(code)
