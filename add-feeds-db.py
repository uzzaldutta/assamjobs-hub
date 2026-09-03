code = """
-- ADDING ADMIT CARDS AND SCHOLARSHIPS TABLES

CREATE TABLE IF NOT EXISTS admit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    exam_name TEXT,
    exam_date DATE,
    release_date DATE,
    download_url TEXT,
    notification_url TEXT,
    
    -- Provenance & Status
    status TEXT DEFAULT 'PUBLISHED',
    official_source_url TEXT,
    discovered_sources JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
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
    
    -- Provenance & Status
    status TEXT DEFAULT 'PUBLISHED',
    official_source_url TEXT,
    discovered_sources JSONB DEFAULT '[]'::jsonb,
    verification_status TEXT DEFAULT 'VERIFICATION_PENDING',
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published admit cards" ON admit_cards FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read published scholarships" ON scholarships FOR SELECT USING (status = 'PUBLISHED');
"""
with open("add_missing_feeds.sql", "w", encoding="utf-8") as f:
    f.write(code)
