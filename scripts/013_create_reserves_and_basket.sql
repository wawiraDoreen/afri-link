/*
  # ACT Basket Reserve Management

  1. New Tables
    - `act_basket_composition`
      - Stores the current basket weights (gold, USD, EUR)
      - Historical tracking of rebalancing events
    - `act_reserves`
      - Tracks actual reserve holdings
      - Real-time balance of gold, USD, EUR backing ACT
    - `reserve_transactions`
      - Logs all reserve changes (deposits, withdrawals, rebalancing)
    - `act_price_history`
      - Historical ACT token prices based on basket valuation
    - `asset_prices`
      - Current and historical prices for gold, USD, EUR

  2. Security
    - Enable RLS on all tables
    - Only super_admin can modify reserves
    - Public read access to basket composition and prices
    - Admins can view reserve transactions

  3. Features
    - Automatic price calculation triggers
    - Reserve ratio monitoring
    - Audit trail for all reserve operations
*/

-- =====================================================
-- 1. ACT BASKET COMPOSITION
-- =====================================================
create table if not exists public.act_basket_composition (
  id uuid primary key default gen_random_uuid(),
  gold_weight decimal(5,4) not null check (gold_weight >= 0 and gold_weight <= 1),
  usd_weight decimal(5,4) not null check (usd_weight >= 0 and usd_weight <= 1),
  eur_weight decimal(5,4) not null check (eur_weight >= 0 and eur_weight <= 1),
  is_active boolean default true,
  activated_at timestamptz default now(),
  activated_by uuid references auth.users(id),
  notes text,
  created_at timestamptz default now(),
  constraint valid_weights check (gold_weight + usd_weight + eur_weight = 1.0)
);

alter table public.act_basket_composition enable row level security;

create policy "Anyone can view active basket composition"
  on public.act_basket_composition for select
  using (true);

create policy "Only super_admin can create basket composition"
  on public.act_basket_composition for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

create policy "Only super_admin can update basket composition"
  on public.act_basket_composition for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

create index if not exists idx_basket_composition_active
  on public.act_basket_composition(is_active, activated_at desc);

-- =====================================================
-- 2. ACT RESERVES
-- =====================================================
create table if not exists public.act_reserves (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('gold', 'usd', 'eur')),
  amount decimal(20,8) not null check (amount >= 0),
  amount_usd decimal(20,2) not null check (amount_usd >= 0),
  location text,
  custody_provider text,
  proof_of_reserve_url text,
  last_verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.act_reserves enable row level security;

create policy "Anyone can view total reserves"
  on public.act_reserves for select
  using (true);

create policy "Only super_admin can insert reserves"
  on public.act_reserves for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

create policy "Only super_admin can update reserves"
  on public.act_reserves for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

create index if not exists idx_reserves_asset_type
  on public.act_reserves(asset_type);

create trigger act_reserves_updated_at
  before update on public.act_reserves
  for each row
  execute function public.handle_updated_at();

-- =====================================================
-- 3. RESERVE TRANSACTIONS
-- =====================================================
create table if not exists public.reserve_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type text not null check (transaction_type in ('deposit', 'withdrawal', 'rebalance', 'audit_adjustment')),
  asset_type text not null check (asset_type in ('gold', 'usd', 'eur')),
  amount decimal(20,8) not null,
  amount_usd decimal(20,2) not null,
  previous_balance decimal(20,8),
  new_balance decimal(20,8),
  reason text not null,
  proof_url text,
  executed_by uuid references auth.users(id),
  approved_by uuid references auth.users(id),
  status text default 'pending' check (status in ('pending', 'approved', 'executed', 'rejected')),
  executed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.reserve_transactions enable row level security;

create policy "Admins can view reserve transactions"
  on public.reserve_transactions for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can create reserve transactions"
  on public.reserve_transactions for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Only super_admin can update reserve transactions"
  on public.reserve_transactions for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

create index if not exists idx_reserve_tx_status
  on public.reserve_transactions(status, created_at desc);

create index if not exists idx_reserve_tx_asset
  on public.reserve_transactions(asset_type, created_at desc);

-- =====================================================
-- 4. ASSET PRICES (Gold, USD, EUR)
-- =====================================================
create table if not exists public.asset_prices (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('gold', 'usd', 'eur')),
  price_usd decimal(20,8) not null check (price_usd > 0),
  price_source text not null,
  fetched_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.asset_prices enable row level security;

create policy "Anyone can view asset prices"
  on public.asset_prices for select
  using (true);

create policy "System can insert asset prices"
  on public.asset_prices for insert
  to authenticated
  with check (true);

create index if not exists idx_asset_prices_type_time
  on public.asset_prices(asset_type, fetched_at desc);

-- =====================================================
-- 5. ACT PRICE HISTORY
-- =====================================================
create table if not exists public.act_price_history (
  id uuid primary key default gen_random_uuid(),
  price_usd decimal(20,8) not null check (price_usd > 0),
  total_supply decimal(20,8) not null check (total_supply >= 0),
  total_reserve_usd decimal(20,2) not null check (total_reserve_usd >= 0),
  reserve_ratio decimal(5,4) not null check (reserve_ratio >= 0),
  gold_component_usd decimal(20,2),
  usd_component decimal(20,2),
  eur_component_usd decimal(20,2),
  basket_composition_id uuid references public.act_basket_composition(id),
  calculated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.act_price_history enable row level security;

create policy "Anyone can view ACT price history"
  on public.act_price_history for select
  using (true);

create policy "System can insert ACT price history"
  on public.act_price_history for insert
  to authenticated
  with check (true);

create index if not exists idx_act_price_time
  on public.act_price_history(calculated_at desc);

-- =====================================================
-- 6. SEED INITIAL DATA
-- =====================================================

-- Insert initial basket composition (40% gold, 30% USD, 30% EUR)
insert into public.act_basket_composition (
  gold_weight,
  usd_weight,
  eur_weight,
  is_active,
  notes
) values (
  0.4000,
  0.3000,
  0.3000,
  true,
  'Initial basket composition: 40% gold, 30% USD, 30% EUR'
) on conflict do nothing;

-- Insert initial asset prices (placeholder values)
insert into public.asset_prices (asset_type, price_usd, price_source) values
  ('gold', 2000.00, 'manual_seed'),
  ('usd', 1.00, 'fixed'),
  ('eur', 1.08, 'manual_seed')
on conflict do nothing;

-- Insert initial reserves (placeholder values - $1M total reserve)
insert into public.act_reserves (asset_type, amount, amount_usd, location, custody_provider) values
  ('gold', 200.00, 400000.00, 'Zurich Vault', 'Swiss Gold Custody'),
  ('usd', 300000.00, 300000.00, 'Bank Account', 'HSBC'),
  ('eur', 277777.78, 300000.00, 'Bank Account', 'Deutsche Bank')
on conflict do nothing;

-- Insert initial ACT price (1 ACT = $1.00 at launch)
insert into public.act_price_history (
  price_usd,
  total_supply,
  total_reserve_usd,
  reserve_ratio,
  gold_component_usd,
  usd_component,
  eur_component_usd,
  basket_composition_id
)
select
  1.00,
  1000000.00,
  1000000.00,
  1.0000,
  400000.00,
  300000.00,
  300000.00,
  id
from public.act_basket_composition
where is_active = true
limit 1
on conflict do nothing;

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to get current ACT price based on reserves and basket
create or replace function public.calculate_act_price()
returns decimal as $$
declare
  v_total_reserve_usd decimal(20,2);
  v_total_supply decimal(20,8);
  v_price_usd decimal(20,8);
begin
  -- Sum total reserves in USD
  select coalesce(sum(amount_usd), 0)
  into v_total_reserve_usd
  from public.act_reserves;

  -- Get total ACT supply from Stellar (placeholder: use 1M for now)
  v_total_supply := 1000000.00;

  -- Calculate price (reserve / supply)
  if v_total_supply > 0 then
    v_price_usd := v_total_reserve_usd / v_total_supply;
  else
    v_price_usd := 1.00;
  end if;

  return v_price_usd;
end;
$$ language plpgsql security definer;

-- Function to get reserve ratio
create or replace function public.get_reserve_ratio()
returns decimal as $$
declare
  v_total_reserve_usd decimal(20,2);
  v_total_supply_usd decimal(20,2);
  v_reserve_ratio decimal(5,4);
  v_act_price decimal(20,8);
begin
  -- Get total reserves
  select coalesce(sum(amount_usd), 0)
  into v_total_reserve_usd
  from public.act_reserves;

  -- Calculate total supply value
  v_total_supply_usd := 1000000.00; -- Placeholder

  -- Calculate ratio
  if v_total_supply_usd > 0 then
    v_reserve_ratio := v_total_reserve_usd / v_total_supply_usd;
  else
    v_reserve_ratio := 1.0000;
  end if;

  return v_reserve_ratio;
end;
$$ language plpgsql security definer;
