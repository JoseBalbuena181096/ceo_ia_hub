-- Auto-delete embeddings when a prompt or video is deleted

-- Function that deletes the corresponding vector
CREATE OR REPLACE FUNCTION delete_content_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM content_vectors
  WHERE content_type = TG_ARGV[0]
    AND content_id = OLD.id;
  RETURN OLD;
END;
$$;

-- Trigger on prompts table
CREATE TRIGGER on_prompt_delete
  AFTER DELETE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION delete_content_vector('prompt');

-- Trigger on videos table
CREATE TRIGGER on_video_delete
  AFTER DELETE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION delete_content_vector('video');
