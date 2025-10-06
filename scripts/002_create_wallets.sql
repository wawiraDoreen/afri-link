-- Create wallets table for ACT token wallets
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

-- Enable RLS
alter table public.wallets enable row level security;

-- RLS Policies for wallets
create policy "Users can view their own wallets"
  on public.wallets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own wallets"
  on public.wallets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own wallets"
  on public.wallets for update
  using (auth.uid() = user_id);

-- Admins can view all wallets
create policy "Admins can view all wallets"
  on public.wallets for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create index for faster lookups
create index wallets_user_id_idx on public.wallets(user_id);
create index wallets_stellar_public_key_idx on public.wallets(stellar_public_key);

-- Add updated_at trigger
create trigger wallets_updated_at
  before update on public.wallets
  for each row
  execute function public.handle_updated_at();
