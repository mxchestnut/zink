-- Public avatars bucket for character portraits.
-- Path convention: {alias}/avatar  (no extension; content-type is stored separately)
-- The bucket is publicly readable so anyone viewing a portfolio sees the avatar.
--
-- Apply in the Supabase dashboard: SQL Editor → paste → Run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read — anyone viewing a sheet can see the avatar.
drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Authenticated users may upload, replace, or delete an avatar.
-- The upload UI is already guarded by canEdit in the React app.
drop policy if exists "avatars authenticated insert" on storage.objects;
create policy "avatars authenticated insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

drop policy if exists "avatars authenticated update" on storage.objects;
create policy "avatars authenticated update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

drop policy if exists "avatars authenticated delete" on storage.objects;
create policy "avatars authenticated delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars');
