-- Create system_settings table for platform configuration
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Everyone can view system settings
create policy "Anyone can view system settings"
  on public.system_settings for select
  using (true);

-- Only admins can manage system settings
create policy "Admins can manage system settings"
  on public.system_settings for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Insert default system settings
insert into public.system_settings (key, value, description) values
  ('transaction_fee_percentage', '0.5', 'Transaction fee percentage'),
  ('min_transaction_amount', '1', 'Minimum transaction amount in ACT'),
  ('max_transaction_amount', '100000', 'Maximum transaction amount in ACT'),
  ('kyc_required_for_amount', '1000', 'KYC required for transactions above this amount'),
  ('platform_name', '"AfriLink"', 'Platform name'),
  ('act_token_issuer', '""', 'Stellar ACT token issuer public key'),
  ('treasury_public_key', '""', 'Treasury wallet public key')
on conflict (key) do nothing;

-- Add updated_at trigger
create trigger system_settings_updated_at
  before update on public.system_settings
  for each row
  execute function public.handle_updated_at();
