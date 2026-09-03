code = """
-- ADD DETAILED TRACKING COLUMNS TO INGESTION RUNS

ALTER TABLE ingestion_runs
ADD COLUMN IF NOT EXISTS items_extracted INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_new INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_duplicate INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_changed INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_rejected INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_missing_link INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_invalid_link INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS items_low_quality INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS warnings_encountered INT DEFAULT 0;
"""
with open("update_ingestion_runs.sql", "w", encoding="utf-8") as f:
    f.write(code)
