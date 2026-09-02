
-- PHASE 6.5: UNIVERSAL INGESTION ENGINE SCHEMA

-- 1. Ingestion Sources
CREATE TABLE IF NOT EXISTS ingestion_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'WEBSITE', -- WEBSITE, API, RSS, PDF
    content_types TEXT[] DEFAULT '{}', -- JOB, TENDER, RESULT, ADMISSION, etc.
    adapter_name TEXT NOT NULL, -- E.g., 'AdzunaAdapter', 'NFRAdapter'
    is_active BOOLEAN DEFAULT TRUE,
    priority INT DEFAULT 2, -- 1=HIGH, 2=NORMAL, 3=LOW
    trust_score INT DEFAULT 100,
    crawl_frequency_minutes INT DEFAULT 1440, -- Default daily
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    last_error TEXT,
    total_items_found BIGINT DEFAULT 0,
    total_items_approved BIGINT DEFAULT 0,
    total_items_rejected BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ingestion Runs (Observability)
CREATE TABLE IF NOT EXISTS ingestion_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES ingestion_sources(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- SUCCESS, FAILED, RUNNING
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    duration_ms BIGINT,
    items_discovered INT DEFAULT 0,
    items_validated INT DEFAULT 0,
    duplicates_found INT DEFAULT 0,
    errors_encountered INT DEFAULT 0,
    run_log TEXT
);

-- 3. Ingestion Queue (Review Workspace)
CREATE TABLE IF NOT EXISTS ingestion_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES ingestion_sources(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- JOB, TENDER, ADMISSION, RESULT, ANSWER_KEY, ADMIT_CARD, NOTIFICATION, SCHOLARSHIP, SCHEME, PRIVATE_JOB, OTHER
    external_id TEXT, -- e.g. ID from external API, or slug
    source_url TEXT,
    title TEXT NOT NULL,
    normalized_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    raw_payload JSONB,
    content_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'NEW', -- NEW, UPDATED, DUPLICATE_RISK, LOW_QUALITY, APPROVED, REJECTED, PUBLISHED, FAILED
    quality_score INT DEFAULT 0,
    duplicate_score FLOAT DEFAULT 0.0,
    duplicate_of TEXT, -- references an existing public record ID or queue ID
    validation_errors JSONB DEFAULT '[]'::jsonb,
    validation_warnings JSONB DEFAULT '[]'::jsonb,
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_id, content_hash) -- Prevent identical payload flooding
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_ingestion_queue_status ON ingestion_queue(status);
CREATE INDEX IF NOT EXISTS idx_ingestion_queue_content_type ON ingestion_queue(content_type);
CREATE INDEX IF NOT EXISTS idx_ingestion_queue_source_id ON ingestion_queue(source_id);
CREATE INDEX IF NOT EXISTS idx_ingestion_runs_source_id ON ingestion_runs(source_id);

-- 4. RPC for Duplicate Detection (using pg_trgm for fuzzy title matching on ingestion)
-- NOTE: We match against the `jobs` table if content_type = 'JOB'
CREATE OR REPLACE FUNCTION check_job_duplicates(
    p_title TEXT,
    p_organization TEXT,
    p_apply_url TEXT
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    organization TEXT,
    similarity_score FLOAT,
    match_type TEXT
) AS $$
BEGIN
    -- 1. Exact URL Match (Highest confidence)
    RETURN QUERY
    SELECT j.id, j.title, j.organization, 1.0::FLOAT AS similarity_score, 'EXACT_URL'::TEXT AS match_type
    FROM jobs j
    WHERE j.apply_link = p_apply_url AND p_apply_url IS NOT NULL AND p_apply_url != '';

    IF FOUND THEN RETURN; END IF;

    -- 2. Title & Organization Fuzzy Match
    RETURN QUERY
    SELECT 
        j.id, 
        j.title, 
        j.organization,
        similarity(j.title, p_title)::FLOAT AS similarity_score,
        'FUZZY_TITLE'::TEXT AS match_type
    FROM jobs j
    WHERE similarity(j.title, p_title) > 0.6
      AND (p_organization IS NULL OR j.organization ILIKE '%' || p_organization || '%')
    ORDER BY similarity_score DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
