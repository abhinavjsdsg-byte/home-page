-- MARK GROUPS — Step 1 Lead Database
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  interested_in text not null,
  project_location text,
  message text,
  source text not null default 'Website Contact Page',
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  status text not null default 'NEW',
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_status_check check (status in (
    'NEW','CONTACTED','QUALIFIED','SITE VISIT','QUOTATION',
    'NEGOTIATION','WON','LOST','ON HOLD','CLOSED'
  ))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_phone_idx on public.leads (phone);
create index if not exists leads_interested_in_idx on public.leads (interested_in);

create or replace function public.set_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_leads_updated_at();

-- Keep the table private. The Node server uses the Supabase service_role key,
-- which bypasses RLS. Browser clients must never receive that key.
alter table public.leads enable row level security;

-- No public/anon policies are intentionally created in Step 1.
-- This prevents a visitor from directly reading or changing all leads.
