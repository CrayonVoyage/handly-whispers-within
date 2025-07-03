
-- Create enum types for gender and dominant hand
CREATE TYPE public.gender_type AS ENUM ('Female', 'Male', 'Non-binary', 'Prefer not to say');
CREATE TYPE public.hand_type AS ENUM ('Left', 'Right');

-- Create the handly_users table
CREATE TABLE public.handly_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
  gender gender_type NOT NULL,
  dominant_hand hand_type NOT NULL,
  dominant_hand_image_url TEXT,
  non_dominant_hand_image_url TEXT,
  reading_result TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for hand images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hand-images', 'hand-images', true);

-- Enable Row Level Security
ALTER TABLE public.handly_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing public access for now, can be restricted later)
CREATE POLICY "Allow public read access" ON public.handly_users
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.handly_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.handly_users
  FOR UPDATE USING (true);

-- Storage policies for hand-images bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hand-images');

CREATE POLICY "Allow public access to hand images" ON storage.objects
  FOR SELECT USING (bucket_id = 'hand-images');

CREATE POLICY "Allow public delete of hand images" ON storage.objects
  FOR DELETE USING (bucket_id = 'hand-images');
