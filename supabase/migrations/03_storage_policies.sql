-- ============================================
-- GOSEDMA — Supabase Storage Buckets & Policies
-- ============================================

-- 1. Create Storage Buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('gallery', 'gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', true, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- 2. Enable Storage Security Policies (on storage.objects table)

-- Allow public read access to all public buckets
create policy "Allow public read access to gallery"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Allow public read access to avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Allow public read access to documents"
  on storage.objects for select
  using (bucket_id = 'documents');


-- Allow authenticated administrators full control of objects
create policy "Allow admin full control of gallery objects"
  on storage.objects for all
  using (
    bucket_id = 'gallery' 
    and (select public.is_admin())
  );

create policy "Allow admin full control of avatars objects"
  on storage.objects for all
  using (
    bucket_id = 'avatars' 
    and (select public.is_admin())
  );

create policy "Allow admin full control of documents objects"
  on storage.objects for all
  using (
    bucket_id = 'documents' 
    and (select public.is_admin())
  );
