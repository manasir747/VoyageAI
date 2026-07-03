begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types, owner_id, type)
values
  ('avatars', 'avatars', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/heic']::text[], null, 'STANDARD'),
  ('profile-banners', 'profile-banners', false, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/heic']::text[], null, 'STANDARD'),
  ('trip-documents', 'trip-documents', false, 26214400, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[], null, 'STANDARD'),
  ('booking-documents', 'booking-documents', false, 26214400, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']::text[], null, 'STANDARD'),
  ('itinerary-assets', 'itinerary-assets', false, 20971520, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/json', 'text/plain']::text[], null, 'STANDARD'),
  ('ai-attachments', 'ai-attachments', false, 26214400, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'application/json', 'text/plain', 'text/csv']::text[], null, 'STANDARD'),
  ('review-media', 'review-media', false, 20971520, array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'video/mp4', 'video/quicktime']::text[], null, 'STANDARD'),
  ('imports', 'imports', false, 52428800, array['text/csv', 'application/json', 'application/zip', 'application/pdf']::text[], null, 'STANDARD'),
  ('exports', 'exports', false, 52428800, array['text/csv', 'application/json', 'application/zip', 'application/pdf']::text[], null, 'STANDARD')
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  owner_id = excluded.owner_id,
  type = excluded.type,
  updated_at = now();

create policy storage_buckets_read_authenticated on storage.buckets
  for select to authenticated
  using (id in ('avatars', 'profile-banners', 'trip-documents', 'booking-documents', 'itinerary-assets', 'ai-attachments', 'review-media', 'imports', 'exports'));

create policy storage_objects_owner_all on storage.objects
  for all to authenticated
  using (
    bucket_id in ('avatars', 'profile-banners', 'trip-documents', 'booking-documents', 'itinerary-assets', 'ai-attachments', 'review-media', 'imports', 'exports')
    and owner_id = auth.uid()::text
  )
  with check (
    bucket_id in ('avatars', 'profile-banners', 'trip-documents', 'booking-documents', 'itinerary-assets', 'ai-attachments', 'review-media', 'imports', 'exports')
    and owner_id = auth.uid()::text
  );

commit;