-- Fix table structure and add missing columns
-- This script safely adds missing columns to existing tables

-- First, let's check and fix the profiles table
DO $$ 
BEGIN
  -- Add user_id to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    -- Copy id to user_id if needed
    UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
  END IF;
END $$;

-- Fix wallets table - ensure user_id exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wallets' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.wallets ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix transactions table - ensure user_id exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Update RLS policies to work without recursion
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.wallets;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Anyone can view active currencies" ON public.currencies;
DROP POLICY IF EXISTS "Anyone can view exchange rates" ON public.exchange_rates;
DROP POLICY IF EXISTS "Admins can manage currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can insert currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can update currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can delete currencies" ON public.currencies;

-- Recreate policies without recursion
-- Make admin_users readable by authenticated users (no recursion)
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Authenticated users can view admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR auth.uid() = user_id);

-- Wallets policies
CREATE POLICY "Users can view their own wallets"
  ON public.wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Currencies - public read, admin write
CREATE POLICY "Anyone can view active currencies"
  ON public.currencies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage currencies"
  ON public.currencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Exchange rates - public read
CREATE POLICY "Anyone can view exchange rates"
  ON public.exchange_rates FOR SELECT
  USING (true);
