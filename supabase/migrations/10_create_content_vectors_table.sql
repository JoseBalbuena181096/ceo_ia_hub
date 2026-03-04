-- Habilitar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla de vectores de contenido (prompts y videos)
CREATE TABLE IF NOT EXISTS content_vectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('prompt', 'video')),
  content_id UUID NOT NULL,
  content_chunk TEXT NOT NULL,
  embedding VECTOR(768),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(content_type, content_id)
);

ALTER TABLE content_vectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read vectors"
  ON content_vectors FOR SELECT TO authenticated USING (true);

-- Índices para búsqueda eficiente
CREATE INDEX idx_content_vectors_type ON content_vectors(content_type);
CREATE INDEX idx_content_vectors_content_id ON content_vectors(content_id);

-- Función de búsqueda por similitud coseno
CREATE OR REPLACE FUNCTION match_content_vectors(
  query_embedding VECTOR(768),
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
