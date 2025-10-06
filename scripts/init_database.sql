-- =====================================================
-- AFRILINK DATABASE INITIALIZATION
-- =====================================================

-- Create trigger function for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =====================================================
-- 1. PROFILES & ADMIN USERS
-- =====================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone_number text,
  country text,
  date_of_birth date,
  role text default 'user' check (role in ('user', 'admin', 'super_admin')),
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  kyc_verified_at timestamptz,
  two_factor_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy if not exists "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create trigger if not exists profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- =====================================================
-- 2. WALLETS
-- =====================================================

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stellar_public_key text not null unique,
  stellar_secret_key_encrypted text not null,
  balance numeric(20, 7) default 0 check (balance >= 0),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.wallets enable row level security;

create policy if not exists "Users can view their own wallets"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own wallets"
  on public.wallets for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own wallets"
  on public.wallets for update
  using (auth.uid() = user_id);

create index if not exists wallets_user_id_idx on public.wallets(user_id);
create index if not exists wallets_stellar_public_key_idx on public.wallets(stellar_public_key);

create trigger if not exists wallets_updated_at
  before update on public.wallets
  for each row
  execute function public.handle_updated_at();

-- =====================================================
-- 3. CURRENCIES & EXCHANGE RATES
-- =====================================================

create table if not exists public.currencies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  symbol text not null,
  country text not null,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.currencies enable row level security;

create policy if not exists "Anyone can view active currencies"
  on public.currencies for select
  using (is_active = true);

create trigger if not exists currencies_updated_at
  before update on public.currencies
  for each row
  execute function public.handle_updated_at();

-- Exchange rates
create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  from_currency_code text not null,
  to_currency_code text not null,
  rate numeric(20, 8) not null check (rate > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(from_currency_code, to_currency_code)
);

alter table public.exchange_rates enable row level security;

create policy if not exists "Anyone can view exchange rates"
  on public.exchange_rates for select
  using (true);

create index if not exists exchange_rates_from_to_idx on public.exchange_rates(from_currency_code, to_currency_code);

create trigger if not exists exchange_rates_updated_at
  before update on public.exchange_rates
  for each row
  execute function public.handle_updated_at();

-- =====================================================
-- 4. TRANSACTIONS
-- =====================================================

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_hash text unique,
  from_wallet_id uuid references public.wallets(id),
  to_wallet_id uuid references public.wallets(id),
  from_user_id uuid references auth.users(id),
  to_user_id uuid references auth.users(id),
  amount numeric(20, 7) not null check (amount > 0),
  transaction_type text not null check (transaction_type in ('transfer', 'exchange', 'deposit', 'withdrawal')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  currency_code text,
  exchange_rate numeric(20, 8),
  fee numeric(20, 7) default 0,
  description text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy if not exists "Users can view their own transactions"
  on public.transactions for select
  using (
    auth.uid() = from_user_id or auth.uid() = to_user_id
  );

create policy if not exists "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = from_user_id);

create index if not exists transactions_from_user_id_idx on public.transactions(from_user_id);
create index if not exists transactions_to_user_id_idx on public.transactions(to_user_id);
create index if not exists transactions_status_idx on public.transactions(status);
create index if not exists transactions_created_at_idx on public.transactions(created_at desc);
create index if not exists transactions_hash_idx on public.transactions(transaction_hash);

create trigger if not exists transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.handle_updated_at();

-- =====================================================
-- 5. KYC DOCUMENTS
-- =====================================================

create table if not exists public.kyc_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('passport', 'national_id', 'drivers_license', 'proof_of_address')),
  document_number text,
  document_url text not null,
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.kyc_documents enable row level security;

create policy if not exists "Users can view their own KYC documents"
  on public.kyc_documents for select
  using (auth.uid() = user_id);

create policy if not exists "Users can insert their own KYC documents"
  on public.kyc_documents for insert
  with check (auth.uid() = user_id);

create index if not exists kyc_documents_user_id_idx on public.kyc_documents(user_id);
create index if not exists kyc_documents_status_idx on public.kyc_documents(verification_status);

create trigger if not exists kyc_documents_updated_at
  before update on public.kyc_documents
  for each row
  execute function public.handle_updated_at();

-- =====================================================
-- 6. SEED CURRENCIES
-- =====================================================

insert into public.currencies (code, name, symbol, country, is_active) values
  ('ACT', 'African Currency Token', 'ACT', 'Pan-African', true),
  ('NGN', 'Nigerian Naira', '₦', 'Nigeria', true),
  ('KES', 'Kenyan Shilling', 'KSh', 'Kenya', true),
  ('ZAR', 'South African Rand', 'R', 'South Africa', true),
  ('GHS', 'Ghanaian Cedi', '₵', 'Ghana', true),
  ('EGP', 'Egyptian Pound', 'E£', 'Egypt', true),
  ('TZS', 'Tanzanian Shilling', 'TSh', 'Tanzania', true),
  ('UGX', 'Ugandan Shilling', 'USh', 'Uganda', true),
  ('MAD', 'Moroccan Dirham', 'DH', 'Morocco', true),
  ('ETB', 'Ethiopian Birr', 'Br', 'Ethiopia', true),
  ('XOF', 'West African CFA Franc', 'CFA', 'West Africa', true),
  ('USD', 'US Dollar', '$', 'United States', true),
  ('EUR', 'Euro', '€', 'European Union', true),
  ('GBP', 'British Pound', '£', 'United Kingdom', true)
on conflict (code) do nothing;

-- =====================================================
-- 7. SEED EXCHANGE RATES (ACT to other currencies)
-- =====================================================

insert into public.exchange_rates (from_currency_code, to_currency_code, rate) values
  ('ACT', 'NGN', 1500.50),
  ('ACT', 'KES', 125.75),
  ('ACT', 'ZAR', 17.85),
  ('ACT', 'GHS', 12.40),
  ('ACT', 'EGP', 48.20),
  ('ACT', 'TZS', 2485.00),
  ('ACT', 'UGX', 3650.00),
  ('ACT', 'MAD', 9.95),
  ('ACT', 'ETB', 112.30),
  ('ACT', 'XOF', 615.40),
  ('ACT', 'USD', 1.00),
  ('ACT', 'EUR', 0.92),
  ('ACT', 'GBP', 0.79)
on conflict (from_currency_code, to_currency_code) do update
  set rate = excluded.rate, updated_at = now();