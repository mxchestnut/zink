-- character_bios: persistent, public-readable portfolio bios, keyed by alias.
--
-- Each onee.cloud/<alias> page reads its bio from here (anonymously, read-only)
-- so the owner's edits are visible to every visitor instead of living in one
-- browser's localStorage. Writes are restricted to the row's owner, and the
-- reserved "zink" alias is additionally locked to a single account by email.
--
-- Apply this in the Supabase dashboard: SQL Editor → paste → Run.

create table if not exists public.character_bios (
  alias         text primary key,
  profile       text not null default '',
  dossier_html  text not null default '',
  closing_quote text not null default '',
  user_id       uuid references auth.users (id) on delete set null,
  updated_at    timestamptz not null default now()
);

alter table public.character_bios enable row level security;

-- Anyone (including signed-out visitors) can read a bio — the page is public.
drop policy if exists "character_bios public read" on public.character_bios;
create policy "character_bios public read"
  on public.character_bios
  for select
  using (true);

-- A signed-in user may create a row they own. "zink" is reserved for one
-- account, so nobody else can ever insert it (no land-grab on the alias).
drop policy if exists "character_bios owner insert" on public.character_bios;
create policy "character_bios owner insert"
  on public.character_bios
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (alias <> 'zink' or lower(auth.jwt() ->> 'email') = 'mxchestnut@gmail.com')
  );

-- A user may update a row they own; "zink" stays locked to the owner email.
drop policy if exists "character_bios owner update" on public.character_bios;
create policy "character_bios owner update"
  on public.character_bios
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (alias <> 'zink' or lower(auth.jwt() ->> 'email') = 'mxchestnut@gmail.com')
  );

-- A user may delete a row they own (used by "Reset to defaults").
drop policy if exists "character_bios owner delete" on public.character_bios;
create policy "character_bios owner delete"
  on public.character_bios
  for delete
  to authenticated
  using (auth.uid() = user_id);
