-- Core table for the full website content payload.
create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Admin users allowed to modify content.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Keep updated_at fresh on updates.
create or replace function public.touch_site_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row
execute function public.touch_site_content_updated_at();

alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

-- Public site can read published content.
drop policy if exists "public_read_site_content" on public.site_content;
create policy "public_read_site_content"
on public.site_content
for select
to anon, authenticated
using (true);

-- Only authenticated active admins can insert/update/delete content.
drop policy if exists "admin_write_site_content" on public.site_content;
create policy "admin_write_site_content"
on public.site_content
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid()
      and a.is_active = true
  )
)
with check (
  exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid()
      and a.is_active = true
  )
);

-- Admin users table is visible only to authenticated admins.
drop policy if exists "admin_read_admin_users" on public.admin_users;
create policy "admin_read_admin_users"
on public.admin_users
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users a
    where a.user_id = auth.uid()
      and a.is_active = true
  )
);

-- Service role or SQL editor should manage admin_users writes.
drop policy if exists "deny_client_write_admin_users" on public.admin_users;
create policy "deny_client_write_admin_users"
on public.admin_users
for all
to authenticated
using (false)
with check (false);

-- Seed singleton content row (safe to run repeatedly).
insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;
