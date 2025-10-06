-- Create currencies table for supported fiat currencies
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

-- Enable RLS
alter table public.currencies enable row level security;

-- Everyone can view active currencies
create policy "Anyone can view active currencies"
  on public.currencies for select
  using (is_active = true);

-- Only admins can insert/update/delete currencies
create policy "Admins can manage currencies"
  on public.currencies for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create exchange_rates table for real-time currency rates
create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  from_currency_code text not null,
  to_currency_code text not null,
  rate numeric(20, 8) not null check (rate > 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(from_currency_code, to_currency_code)
);

-- Enable RLS
alter table public.exchange_rates enable row level security;

-- Everyone can view exchange rates
create policy "Anyone can view exchange rates"
  on public.exchange_rates for select
  using (true);

-- Only admins can manage exchange rates
create policy "Admins can manage exchange rates"
  on public.exchange_rates for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create indexes
create index exchange_rates_from_to_idx on public.exchange_rates(from_currency_code, to_currency_code);

-- Add updated_at triggers
create trigger currencies_updated_at
  before update on public.currencies
  for each row
  execute function public.handle_updated_at();

create trigger exchange_rates_updated_at
  before update on public.exchange_rates
  for each row
  execute function public.handle_updated_at();
