-- Second Brain AI — Supabase schema
-- Run this in the Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

create table if not exists public.content_objects (
  id               uuid primary key default gen_random_uuid(),
  user_id          text not null default 'demo',
  source_url       text not null,
  source_type      text not null,
  title            text not null,
  description      text,
  author           text,
  duration_seconds integer,
  transcript       text,
  summary          text,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists content_objects_created_at_idx
  on public.content_objects (created_at desc);

-- Row Level Security
alter table public.content_objects enable row level security;

-- Demo policy: allow anon key full access (single-user / demo mode).
-- Tighten this once you add real auth.
drop policy if exists "allow all (demo)" on public.content_objects;
create policy "allow all (demo)"
  on public.content_objects
  for all
  using (true)
  with check (true);
