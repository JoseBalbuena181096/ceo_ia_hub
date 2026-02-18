-- Migration 06: Create favorites table
CREATE TABLE public.favorites (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('prompt', 'video')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites." ON favorites FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites." ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites." ON favorites FOR DELETE
  USING (auth.uid() = user_id);
