code = """
-- PHASE 6.6: PRODUCTION INGESTION SCHEMA UPGRADES

-- 1. Modify ingestion_sources
ALTER TABLE ingestion_sources ADD COLUMN IF NOT EXISTS tier INT DEFAULT 2;
ALTER TABLE ingestion_sources ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT false;
ALTER TABLE ingestion_sources ADD COLUMN IF NOT EXISTS feed_type TEXT DEFAULT 'JOB';

-- 2. Modify ingestion_queue
ALTER TABLE ingestion_queue ADD COLUMN IF NOT EXISTS change_diff JSONB;

-- 3. Create job_provenance (Source Observations)
CREATE TABLE IF NOT EXISTS job_provenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_id TEXT NOT NULL, -- references jobs.id (using TEXT because jobs.id is TEXT in current schema)
    content_type TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    source_tier INT DEFAULT 2,
    is_official BOOLEAN DEFAULT false,
    content_hash TEXT,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_job_provenance_canonical ON job_provenance(canonical_id);
CREATE INDEX IF NOT EXISTS idx_job_provenance_url ON job_provenance(source_url);

-- 4. Minimal fields on `jobs` for provenance UI
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'VERIFICATION_PENDING';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS official_source_url TEXT;
"""
with open("production_ingestion_schema.sql", "w", encoding="utf-8") as f:
    f.write(code)
