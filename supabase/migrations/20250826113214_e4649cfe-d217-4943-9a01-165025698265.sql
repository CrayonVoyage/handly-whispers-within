-- Tighten RLS on handly_users and add secure RPCs for comparison

-- 1) Drop overly permissive policies
DROP POLICY IF EXISTS "Allow public read access" ON public.handly_users;
DROP POLICY IF EXISTS "Allow public insert access" ON public.handly_users;
DROP POLICY IF EXISTS "Allow public update access" ON public.handly_users;

-- Ensure RLS is enabled
ALTER TABLE public.handly_users ENABLE ROW LEVEL SECURITY;

-- 2) Restrictive, user-scoped policies
CREATE POLICY "Users can view their own handly data"
ON public.handly_users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own handly data"
ON public.handly_users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own handly data"
ON public.handly_users
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 3) Secure helper RPCs to preserve Compare functionality without exposing full table
-- Returns the list of user_ids that have completed readings (no sensitive data)
CREATE OR REPLACE FUNCTION public.list_completed_reading_user_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT DISTINCT user_id
  FROM public.handly_users
  WHERE reading_result IS NOT NULL
    AND user_id IS NOT NULL;
$$;

-- Returns a sanitized, latest reading for a given user for comparison
CREATE OR REPLACE FUNCTION public.get_reading_for_compare(target_user_id uuid)
RETURNS TABLE (
  age integer,
  gender text,
  dominant_hand text,
  reading_result text,
  palm_lines_data jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    u.age,
    u.gender::text,
    u.dominant_hand::text,
    u.reading_result,
    u.palm_lines_data
  FROM public.handly_users u
  WHERE u.user_id = target_user_id
  ORDER BY u.created_at DESC
  LIMIT 1;
$$;

-- Restrict RPC execution to authenticated users only
REVOKE ALL ON FUNCTION public.list_completed_reading_user_ids() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_reading_for_compare(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_completed_reading_user_ids() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_reading_for_compare(uuid) TO authenticated;