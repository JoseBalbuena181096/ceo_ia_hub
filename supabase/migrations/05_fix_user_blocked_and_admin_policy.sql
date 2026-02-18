-- Fix: Ensure is_blocked column exists and add admin UPDATE policy on profiles
-- This migration is idempotent (safe to re-run).

-- 1. Add is_blocked column if it doesn't already exist (from migration 04)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false;

-- 2. Add RLS policy so admins can UPDATE any profile (not just their own)
-- Without this, toggleBlockUser fails silently because the existing policy
-- only allows auth.uid() = id (users editing their own profile).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'profiles'
      AND policyname = 'Admins can update any profile.'
  ) THEN
    CREATE POLICY "Admins can update any profile."
      ON public.profiles FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE id = auth.uid() AND is_admin = true
        )
      );
  END IF;
END
$$;
