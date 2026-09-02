code = """
-- PHASE 6.7: FEED ECOSYSTEM EXPANSION (Tenders, Admissions, Results)

-- 1. TENDERS TABLE
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    department TEXT,
    tender_number TEXT,
    tender_type TEXT,
    location TEXT,
    estimated_value TEXT,
    emd TEXT,
    publication_date DATE,
    closing_date DATE,
    opening_date DATE,
    eligibility TEXT,
    tender_document TEXT,
    
    -- Provenance & Status
    status TEXT DEFAULT 'DRAFT',
    official_source_url TEXT,
    discovered_sources JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADMISSIONS TABLE
CREATE TABLE IF NOT EXISTS admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    course TEXT,
    program TEXT,
    admission_type TEXT,
    eligibility TEXT,
    application_start DATE,
    application_deadline DATE,
    entrance_exam TEXT,
    exam_date DATE,
    fees TEXT,
    selection_process TEXT,
    official_notification TEXT,
    application_link TEXT,
    
    -- Provenance & Status
    status TEXT DEFAULT 'DRAFT',
    official_source_url TEXT,
    discovered_sources JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESULTS TABLE
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    exam_name TEXT,
    result_type TEXT,
    exam_date DATE,
    result_date DATE,
    year INT,
    result_pdf TEXT,
    result_url TEXT,
    
    -- Provenance & Status
    status TEXT DEFAULT 'DRAFT',
    official_source_url TEXT,
    discovered_sources JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published tenders" ON tenders FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published admissions" ON admissions FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published results" ON results FOR SELECT USING (status = 'PUBLISHED');

-- Update Search RPC (Mocked up here for reference, actual union logic needed if rewriting global_discovery_search)
"""
with open("feed_ecosystem_schema.sql", "w", encoding="utf-8") as f:
    f.write(code)
