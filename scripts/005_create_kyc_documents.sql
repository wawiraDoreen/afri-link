-- Create kyc_documents table for KYC verification
create table if not exists public.kyc_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('passport', 'national_id', 'drivers_license', 'proof_of_address')),
  document_number text,
  document_url text not null,
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  verified_by uuid references public.admin_users(id),
  verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.kyc_documents enable row level security;

-- Users can view their own KYC documents
create policy "Users can view their own KYC documents"
  on public.kyc_documents for select
  using (auth.uid() = user_id);

-- Users can insert their own KYC documents
create policy "Users can insert their own KYC documents"
  on public.kyc_documents for insert
  with check (auth.uid() = user_id);

-- Admins can view all KYC documents
create policy "Admins can view all KYC documents"
  on public.kyc_documents for select
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Admins can update KYC documents
create policy "Admins can update KYC documents"
  on public.kyc_documents for update
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Create index
create index kyc_documents_user_id_idx on public.kyc_documents(user_id);
create index kyc_documents_status_idx on public.kyc_documents(verification_status);

-- Add updated_at trigger
create trigger kyc_documents_updated_at
  before update on public.kyc_documents
  for each row
  execute function public.handle_updated_at();
