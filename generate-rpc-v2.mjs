import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function upgradeRPC() {
  const sql = `
DROP FUNCTION IF EXISTS global_discovery_search(text);

CREATE OR REPLACE FUNCTION global_discovery_search(
    search_query text,
    limit_val int DEFAULT 20,
    offset_val int DEFAULT 0
)
RETURNS TABLE (
    item_id text,
    item_type text,
    title text,
    subtitle text,
    metadata jsonb,
    relevance_score float,
    total_count bigint
) AS $$
DECLARE
    q_query tsquery;
BEGIN
    q_query := plainto_tsquery('english', search_query);

    RETURN QUERY
    WITH matches AS (
        -- 1. JOBS
        SELECT 
            j.id::text AS item_id,
            'JOB'::text AS item_type,
            j.title AS title,
            COALESCE(j.organization, '') AS subtitle,
            jsonb_build_object(
                'job_type', j.job_type,
                'qualification', j.qualification,
                'location', j.location,
                'last_date', j.last_date
            ) AS metadata,
            (
                ts_rank(
                    setweight(to_tsvector('english', j.title), 'A') || 
                    setweight(to_tsvector('english', COALESCE(j.description, '')), 'C'),
                    q_query
                ) + similarity(j.title, search_query)
            )::float AS relevance_score
        FROM jobs j
        WHERE 
            (to_tsvector('english', j.title || ' ' || COALESCE(j.description, '')) @@ q_query
             OR j.title % search_query)
            AND j.title NOT ILIKE '%BANNED_KEYWORD%'

        UNION ALL

        -- 2. EXAMS
        SELECT 
            e.id::text,
            'EXAM'::text,
            e.title,
            'AssamJobs Hub Exam'::text,
            jsonb_build_object(
                'slug', e.slug,
                'description', e.description
            ),
            (
                ts_rank(setweight(to_tsvector('english', e.title), 'A'), q_query) + 
                similarity(e.title, search_query)
            )::float
        FROM prep_exams e
        WHERE 
            e.status = 'PUBLISHED' AND
            (to_tsvector('english', e.title) @@ q_query OR e.title % search_query)

        UNION ALL

        -- 3. TOPICS (Practice)
        SELECT 
            t.id::text,
            'TOPIC'::text,
            t.title,
            c.title || ' • ' || s.title AS subtitle,
            jsonb_build_object(
                'chapter_id', c.id,
                'subject_id', s.id
            ),
            (
                ts_rank(setweight(to_tsvector('english', t.title), 'A'), q_query) + 
                similarity(t.title, search_query)
            )::float
        FROM prep_topics t
        JOIN prep_chapters c ON t.chapter_id = c.id
        JOIN prep_subjects s ON c.subject_id = s.id
        WHERE 
            (to_tsvector('english', t.title) @@ q_query OR t.title % search_query)

        UNION ALL

        -- 4. MOCK TESTS
        SELECT 
            m.id::text,
            'MOCK_TEST'::text,
            m.title,
            e.title AS subtitle,
            jsonb_build_object(
                'duration_minutes', m.duration_minutes,
                'total_marks', m.total_marks
            ),
            (
                ts_rank(setweight(to_tsvector('english', m.title), 'A'), q_query) + 
                similarity(m.title, search_query)
            )::float
        FROM prep_mock_tests m
        JOIN prep_exams e ON m.exam_id = e.id
        WHERE 
            m.status = 'PUBLISHED' AND
            (to_tsvector('english', m.title) @@ q_query OR m.title % search_query)
    )
    SELECT 
        m.item_id, m.item_type, m.title, m.subtitle, m.metadata, m.relevance_score,
        COUNT(*) OVER() AS total_count
    FROM matches m
    ORDER BY m.relevance_score DESC
    LIMIT limit_val
    OFFSET offset_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // We have to run this sql somehow. Using Supabase JS client doesn't support raw SQL queries directly, 
  // but we can create a temporary edge function or just ask the user to run it if necessary.
  // Wait, I can use postgres directly if pg is installed or REST api if RPC `exec_sql` exists.
  console.log(sql);
}
upgradeRPC();
