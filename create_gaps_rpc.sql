
CREATE OR REPLACE FUNCTION get_topic_gaps()
RETURNS TABLE (
  exam_id UUID,
  exam_title TEXT,
  subject_id UUID,
  subject_title TEXT,
  chapter_id UUID,
  chapter_title TEXT,
  topic_id UUID,
  topic_title TEXT,
  total_questions BIGINT,
  published_questions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id AS exam_id,
    e.title AS exam_title,
    s.id AS subject_id,
    s.title AS subject_title,
    c.id AS chapter_id,
    c.title AS chapter_title,
    t.id AS topic_id,
    t.title AS topic_title,
    COUNT(q.id) AS total_questions,
    COUNT(q.id) FILTER (WHERE q.status = 'PUBLISHED') AS published_questions
  FROM prep_topics t
  JOIN prep_chapters c ON t.chapter_id = c.id
  JOIN prep_subjects s ON c.subject_id = s.id
  JOIN prep_exams e ON s.exam_id = e.id
  LEFT JOIN prep_questions q ON q.topic_id = t.id
  GROUP BY e.id, e.title, s.id, s.title, c.id, c.title, t.id, t.title
  ORDER BY e.title, s.title, c.title, t.title;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
