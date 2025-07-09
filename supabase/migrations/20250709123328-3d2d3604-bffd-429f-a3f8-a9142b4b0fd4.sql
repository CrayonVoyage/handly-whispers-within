-- Add structured palm reading data to handly_users table
ALTER TABLE public.handly_users 
ADD COLUMN palm_lines_data JSONB;

-- Add a helpful comment
COMMENT ON COLUMN public.handly_users.palm_lines_data IS 'Structured data for individual palm lines (life, head, heart, etc.) with shape, depth, and interpretation';

-- Create an index for better performance when querying palm lines data
CREATE INDEX idx_handly_users_palm_lines_data ON public.handly_users USING GIN (palm_lines_data);