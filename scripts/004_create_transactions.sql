-- Create transactions table for all ACT token transactions
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

-- Enable RLS
alter table public.transactions enable row level security;

-- Users can view their own transactions
create policy "Users can view their own transactions"
  on public.transactions for select
  using (
    auth.uid() = from_user_id or auth.uid() = to_user_id
  );

-- Users can insert their own transactions
create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = from_user_id);

-- Admins can view all transactions
create policy "Admins can view all transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Admins can update transaction status
create policy "Admins can update transactions"
  on public.transactions for update
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create indexes for faster queries
create index transactions_from_user_id_idx on public.transactions(from_user_id);
create index transactions_to_user_id_idx on public.transactions(to_user_id);
create index transactions_status_idx on public.transactions(status);
create index transactions_created_at_idx on public.transactions(created_at desc);
create index transactions_hash_idx on public.transactions(transaction_hash);

-- Add updated_at trigger
create trigger transactions_updated_at
  before update on public.transactions
  for each row
  execute function public.handle_updated_at();
