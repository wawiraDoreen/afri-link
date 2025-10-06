-- Fix infinite recursion in RLS policies
-- Drop all problematic policies first, then recreate with correct logic

-- ============================================
-- DROP EXISTING POLICIES
-- ============================================

-- Drop admin_users policies
drop policy if exists "Admins can view admin users" on public.admin_users;
drop policy if exists "Admins can manage admin users" on public.admin_users;

-- Drop currencies policies
drop policy if exists "Anyone can view active currencies" on public.currencies;
drop policy if exists "Admins can manage currencies" on public.currencies;

-- Drop exchange_rates policies
drop policy if exists "Anyone can view exchange rates" on public.exchange_rates;
drop policy if exists "Admins can manage exchange rates" on public.exchange_rates;

-- Drop profiles policies
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Drop wallets policies
drop policy if exists "Users can view their own wallets" on public.wallets;
drop policy if exists "Users can update their own wallets" on public.wallets;

-- Drop transactions policies
drop policy if exists "Users can view their own transactions" on public.transactions;
drop policy if exists "Users can create transactions" on public.transactions;

-- Drop kyc_documents policies
drop policy if exists "Users can view their own KYC documents" on public.kyc_documents;
drop policy if exists "Users can create KYC documents" on public.kyc_documents;
drop policy if exists "Admins can view all KYC documents" on public.kyc_documents;
drop policy if exists "Admins can update KYC documents" on public.kyc_documents;

-- ============================================
-- RECREATE POLICIES WITH CORRECT LOGIC
-- ============================================

-- Admin Users Table
-- Use auth.uid() directly without recursion
create policy "Admins can view admin users"
  on public.admin_users for select
  using (auth.uid() = id);

create policy "Admins can manage admin users"
  on public.admin_users for all
  using (auth.uid() = id);

-- Currencies Table
-- PUBLIC READ ACCESS - no admin check needed for viewing
create policy "Anyone can view active currencies"
  on public.currencies for select
  using (is_active = true);

-- For write operations, check if user is admin by direct lookup
create policy "Admins can insert currencies"
  on public.currencies for insert
  with check (
    auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can update currencies"
  on public.currencies for update
  using (
    auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can delete currencies"
  on public.currencies for delete
  using (
    auth.uid() in (select id from public.admin_users)
  );

-- Exchange Rates Table
-- PUBLIC READ ACCESS - no admin check needed
create policy "Anyone can view exchange rates"
  on public.exchange_rates for select
  using (true);

create policy "Admins can insert exchange rates"
  on public.exchange_rates for insert
  with check (
    auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can update exchange rates"
  on public.exchange_rates for update
  using (
    auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can delete exchange rates"
  on public.exchange_rates for delete
  using (
    auth.uid() in (select id from public.admin_users)
  );

-- Profiles Table
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    auth.uid() in (select id from public.admin_users)
  );

-- Wallets Table
create policy "Users can view their own wallets"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy "Users can update their own wallets"
  on public.wallets for update
  using (auth.uid() = user_id);

create policy "Admins can view all wallets"
  on public.wallets for select
  using (
    auth.uid() in (select id from public.admin_users)
  );

-- Transactions Table
create policy "Users can view their own transactions"
  on public.transactions for select
  using (
    auth.uid() = sender_wallet_id::uuid 
    or auth.uid() = receiver_wallet_id::uuid
  );

create policy "Users can create transactions"
  on public.transactions for insert
  with check (auth.uid() = sender_wallet_id::uuid);

create policy "Admins can view all transactions"
  on public.transactions for select
  using (
    auth.uid() in (select id from public.admin_users)
  );

-- KYC Documents Table
create policy "Users can view their own KYC documents"
  on public.kyc_documents for select
  using (auth.uid() = user_id);

create policy "Users can create KYC documents"
  on public.kyc_documents for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all KYC documents"
  on public.kyc_documents for select
  using (
    auth.uid() in (select id from public.admin_users)
  );

create policy "Admins can update KYC documents"
  on public.kyc_documents for update
  using (
    auth.uid() in (select id from public.admin_users)
  );

-- System Settings Table
create policy "Anyone can view system settings"
  on public.system_settings for select
  using (true);

create policy "Admins can manage system settings"
  on public.system_settings for all
  using (
    auth.uid() in (select id from public.admin_users)
  );
