code = """
-- FEED MONITORING & SOURCE RELIABILITY MIGRATION

-- 1. ADD HEALTH TRACKING COLUMNS TO SOURCES
ALTER TABLE ingestion_sources
ADD COLUMN IF NOT EXISTS current_health TEXT DEFAULT 'HEALTHY',
ADD COLUMN IF NOT EXISTS consecutive_failures INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_successful_run TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_failed_run TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_error TEXT;

-- 2. DAILY SUMMARY VIEW FOR FAST ANALYTICS
CREATE OR REPLACE VIEW ingestion_daily_summaries AS
SELECT 
    DATE(started_at) as run_date,
    COUNT(DISTINCT source_id) as sources_checked,
    SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as sources_successful,
    SUM(CASE WHEN status = 'FAILED' OR status = 'STRUCTURE_CHANGED' THEN 1 ELSE 0 END) as sources_failed,
    SUM(CASE WHEN status = 'WARNING' THEN 1 ELSE 0 END) as sources_warning,
    SUM(COALESCE(items_extracted, 0)) as total_extracted,
    SUM(COALESCE(items_new, 0)) as total_new,
    SUM(COALESCE(items_duplicate, 0)) as total_duplicates,
    SUM(COALESCE(items_changed, 0)) as total_changed,
    SUM(COALESCE(items_missing_link, 0)) as total_missing_links,
    SUM(COALESCE(items_invalid_link, 0)) as total_invalid_links,
    SUM(COALESCE(items_low_quality, 0)) as total_low_quality,
    SUM(COALESCE(errors_encountered, 0)) as total_errors
FROM ingestion_runs
GROUP BY DATE(started_at);
"""
with open("FEED_MONITORING_MIGRATION.sql", "w", encoding="utf-8") as f:
    f.write(code)
