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

-- Per-user isolation: each authenticated account can only read and write
-- its own rows. The API routes are also gated by protectApi()
-- (src/lib/supabase/server.ts), so an unauthenticated request is
-- rejected before it ever reaches the table.
drop policy if exists "allow all (demo)" on public.content_objects;
drop policy if exists "users manage own content" on public.content_objects;
create policy "users manage own content"
  on public.content_objects
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
