code = """
-- UPDATED GLOBAL SEARCH RPC FOR ALL FEEDS INCLUDING ADMIT CARDS AND SCHOLARSHIPS

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
      -- 1. JOBS
      SELECT 
        j.id::TEXT AS item_id,
        'JOB'::TEXT AS item_type,
        j.title::TEXT AS title,
        j.organization::TEXT AS subtitle,
        jsonb_build_object('qualification', j.qualification, 'location', j.location, 'job_type', j.job_type, 'last_date', j.last_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(j.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(j.title, search_query))::FLOAT AS relevance_score
      FROM jobs j
      WHERE j.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(j.title, '')) @@ to_tsquery('english', formatted_query) OR j.title % search_query)
      
      UNION ALL
      
      -- 2. TENDERS
      SELECT 
        t.id::TEXT AS item_id,
        'TENDER'::TEXT AS item_type,
        t.title::TEXT AS title,
        t.organization::TEXT AS subtitle,
        jsonb_build_object('tender_number', t.tender_number, 'estimated_value', t.estimated_value, 'closing_date', t.closing_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(t.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(t.title, search_query))::FLOAT AS relevance_score
      FROM tenders t
      WHERE t.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(t.title, '')) @@ to_tsquery('english', formatted_query) OR t.title % search_query)
      
      UNION ALL
      
      -- 3. ADMISSIONS
      SELECT 
        a.id::TEXT AS item_id,
        'ADMISSION'::TEXT AS item_type,
        a.title::TEXT AS title,
        a.institution::TEXT AS subtitle,
        jsonb_build_object('course', a.course, 'application_deadline', a.application_deadline) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(a.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(a.title, search_query))::FLOAT AS relevance_score
      FROM admissions a
      WHERE a.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(a.title, '')) @@ to_tsquery('english', formatted_query) OR a.title % search_query)
      
      UNION ALL

      -- 4. RESULTS
      SELECT 
        r.id::TEXT AS item_id,
        'RESULT'::TEXT AS item_type,
        r.title::TEXT AS title,
        r.organization::TEXT AS subtitle,
        jsonb_build_object('exam_name', r.exam_name, 'result_date', r.result_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(r.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(r.title, search_query))::FLOAT AS relevance_score
      FROM results r
      WHERE r.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(r.title, '')) @@ to_tsquery('english', formatted_query) OR r.title % search_query)

      UNION ALL

      -- 5. ADMIT CARDS
      SELECT 
        ac.id::TEXT AS item_id,
        'ADMIT_CARD'::TEXT AS item_type,
        ac.title::TEXT AS title,
        ac.organization::TEXT AS subtitle,
        jsonb_build_object('exam_name', ac.exam_name, 'exam_date', ac.exam_date, 'release_date', ac.release_date) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(ac.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(ac.title, search_query))::FLOAT AS relevance_score
      FROM admit_cards ac
      WHERE ac.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(ac.title, '')) @@ to_tsquery('english', formatted_query) OR ac.title % search_query)

      UNION ALL

      -- 6. SCHOLARSHIPS
      SELECT 
        s.id::TEXT AS item_id,
        'SCHOLARSHIP'::TEXT AS item_type,
        s.title::TEXT AS title,
        s.organization::TEXT AS subtitle,
        jsonb_build_object('scheme', s.scheme, 'amount', s.amount, 'application_deadline', s.application_deadline) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(s.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.0 + similarity(s.title, search_query))::FLOAT AS relevance_score
      FROM scholarships s
      WHERE s.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(s.title, '')) @@ to_tsquery('english', formatted_query) OR s.title % search_query)
      
      UNION ALL
      
      -- 7. EXAMS
      SELECT 
        e.id::TEXT AS item_id,
        'EXAM'::TEXT AS item_type,
        e.title::TEXT AS title,
        'Competitive Exam'::TEXT AS subtitle,
        jsonb_build_object('slug', e.slug, 'description', e.description) AS metadata,
        (ts_rank(setweight(to_tsvector('english', coalesce(e.title, '')), 'A'), to_tsquery('english', formatted_query)) * 2.5 + similarity(e.title, search_query) * 1.5)::FLOAT AS relevance_score
      FROM prep_exams e
      WHERE e.status = 'PUBLISHED' AND (to_tsvector('english', coalesce(e.title, '')) @@ to_tsquery('english', formatted_query) OR e.title % search_query)
  )
  SELECT 
    u.*,
    (SELECT COUNT(*) FROM unified_results) AS total_count
  FROM unified_results u
  ORDER BY u.relevance_score DESC
  OFFSET offset_val
  LIMIT limit_val;
END;
$$;
"""
with open("update_search_rpc_v2.sql", "w", encoding="utf-8") as f:
    f.write(code)
