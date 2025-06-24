-- Fix sellers table to allow null user_id for scraped data
ALTER TABLE public.sellers ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment to clarify
COMMENT ON COLUMN public.sellers.user_id IS 'References auth.users(id). Can be null for system-generated sellers from scrapers.';