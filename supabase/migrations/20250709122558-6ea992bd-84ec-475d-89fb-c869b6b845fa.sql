-- Add policy to allow authenticated users to view other users' basic profile info for comparison
CREATE POLICY "Allow authenticated users to view basic profile info for comparison" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');