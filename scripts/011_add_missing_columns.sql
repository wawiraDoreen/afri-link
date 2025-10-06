-- Add missing user_id columns if they don't exist
-- This fixes the "column user_id does not exist" error

-- Check and add user_id to wallets if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wallets' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.wallets ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON public.wallets(user_id);
  END IF;
END $$;

-- Check and add from_user_id and to_user_id to transactions if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions' 
    AND column_name = 'from_user_id'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN from_user_id uuid REFERENCES auth.users(id);
    CREATE INDEX IF NOT EXISTS transactions_from_user_id_idx ON public.transactions(from_user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions' 
    AND column_name = 'to_user_id'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN to_user_id uuid REFERENCES auth.users(id);
    CREATE INDEX IF NOT EXISTS transactions_to_user_id_idx ON public.transactions(to_user_id);
  END IF;
END $$;

-- Check and add user_id to user_profiles if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profiles' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles(user_id);
  END IF;
END $$;
