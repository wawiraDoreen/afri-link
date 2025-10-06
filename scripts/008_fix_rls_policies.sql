-- Fix infinite recursion in RLS policies
-- Drop the problematic policies
drop policy if exists "Admins can manage currencies" on public.currencies;
drop policy if exists "Admins can manage exchange rates" on public.exchange_rates;
drop policy if exists "Admins can view admin users" on public.admin_users;

-- Recreate admin_users policy without recursion
create policy "Admins can view admin users"
  on public.admin_users for select
  using (auth.uid() = id);

create policy "Super admins can view all admin users"
  on public.admin_users for select
  using (
    auth.uid() in (
      select id from public.admin_users where role = 'super_admin'
    )
  );

-- Recreate currencies policies - separate read from write
-- Keep the existing "Anyone can view active currencies" policy for SELECT
-- Add admin-only policies for INSERT, UPDATE, DELETE without recursion

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

-- Recreate exchange_rates policies - separate read from write
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
