-- Clean up duplicate records in handly_users table
-- Keep only the most recent record for each user_id that has a reading_result

-- First, let's see what we're working with
-- DELETE duplicate records, keeping only the most recent one with reading_result for each user
WITH ranked_records AS (
  SELECT id, user_id, reading_result, created_at,
         ROW_NUMBER() OVER (
           PARTITION BY user_id 
           ORDER BY 
             CASE WHEN reading_result IS NOT NULL THEN 0 ELSE 1 END, -- Prioritize records with reading_result
             created_at DESC  -- Then by most recent
         ) as rn
  FROM handly_users
  WHERE user_id IS NOT NULL
),
records_to_delete AS (
  SELECT id 
  FROM ranked_records 
  WHERE rn > 1
)
DELETE FROM handly_users 
WHERE id IN (SELECT id FROM records_to_delete);

-- Add unique constraint on user_id to prevent future duplicates
ALTER TABLE handly_users 
ADD CONSTRAINT handly_users_user_id_unique UNIQUE (user_id);