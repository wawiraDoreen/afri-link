-- Complete RLS Policy Fix - Eliminates Infinite Recursion
-- This script drops all existing policies and recreates them properly

-- ============================================
-- STEP 1: Drop all existing policies
-- ============================================

-- Drop admin_users policies
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;

-- Drop profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop wallets policies
DROP POLICY IF EXISTS "Users can view their own wallets" ON public.wallets;
DROP POLICY IF EXISTS "Users can create their own wallet" ON public.wallets;

-- Drop currencies policies
DROP POLICY IF EXISTS "Anyone can view active currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can manage currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can insert currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can update currencies" ON public.currencies;
DROP POLICY IF EXISTS "Admins can delete currencies" ON public.currencies;

-- Drop transactions policies
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.transactions;

-- Drop exchange_rates policies
DROP POLICY IF EXISTS "Anyone can view exchange rates" ON public.exchange_rates;
DROP POLICY IF EXISTS "Admins can manage exchange rates" ON public.exchange_rates;

-- Drop kyc_documents policies
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can create their own KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON public.kyc_documents;

-- Drop system_settings policies
DROP POLICY IF EXISTS "Anyone can view system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;

-- ============================================
-- STEP 2: Create new policies without recursion
-- ============================================

-- ADMIN_USERS: Allow authenticated users to read (no recursion)
-- This is the KEY fix - admin_users must be readable without checking admin status
CREATE POLICY "Authenticated users can view admin users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only existing admins can manage admin users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- PROFILES: Users can manage their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- WALLETS: Users can view and create their own wallets
CREATE POLICY "Users can view their own wallets"
  ON public.wallets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own wallet"
  ON public.wallets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all wallets"
  ON public.wallets FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- CURRENCIES: Public read, admin write
CREATE POLICY "Anyone can view active currencies"
  ON public.currencies FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can view all currencies"
  ON public.currencies FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

CREATE POLICY "Admins can insert currencies"
  ON public.currencies FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

CREATE POLICY "Admins can update currencies"
  ON public.currencies FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

CREATE POLICY "Admins can delete currencies"
  ON public.currencies FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- TRANSACTIONS: Users can view their own, admins can view all
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (
    sender_wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
    OR receiver_wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_wallet_id IN (SELECT id FROM public.wallets WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- EXCHANGE_RATES: Public read, admin write
CREATE POLICY "Anyone can view exchange rates"
  ON public.exchange_rates FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage exchange rates"
  ON public.exchange_rates FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- KYC_DOCUMENTS: Users can view/create their own, admins can view all
CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own KYC documents"
  ON public.kyc_documents FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all KYC documents"
  ON public.kyc_documents FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

CREATE POLICY "Admins can update KYC documents"
  ON public.kyc_documents FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- SYSTEM_SETTINGS: Public read, admin write
CREATE POLICY "Anyone can view system settings"
  ON public.system_settings FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage system settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );
