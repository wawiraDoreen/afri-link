-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone_number text,
  country text,
  date_of_birth date,
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  kyc_verified_at timestamptz,
  two_factor_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create admin_users table for admin access control
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  permissions jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS for admin_users
alter table public.admin_users enable row level security;

-- Admin users can view all admin records
create policy "Admins can view admin users"
  on public.admin_users for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create trigger to auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger admin_users_updated_at
  before update on public.admin_users
  for each row
  execute function public.handle_updated_at();
