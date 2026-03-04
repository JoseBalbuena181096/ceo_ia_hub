-- Update vector dimensions from 768 to 3072 for gemini-embedding-001 model

ALTER TABLE content_vectors
  ALTER COLUMN embedding TYPE VECTOR(3072);

-- Recreate search function with new dimensions
CREATE OR REPLACE FUNCTION match_content_vectors(
  query_embedding VECTOR(3072),
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5,
  filter_content_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content_type TEXT,
  content_id UUID,
  content_chunk TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cv.id,
    cv.content_type,
    cv.content_id,
    cv.content_chunk,
    cv.metadata,
    1 - (cv.embedding <=> query_embedding) AS similarity
  FROM content_vectors cv
  WHERE
    (filter_content_type IS NULL OR cv.content_type = filter_content_type)
    AND 1 - (cv.embedding <=> query_embedding) > match_threshold
  ORDER BY cv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
