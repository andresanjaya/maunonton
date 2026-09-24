-- Local development fixtures only. `supabase db reset` applies this file after
-- migrations. The deterministic UUIDs make manual RLS checks repeatable.
-- Fixture password for every seeded account: beta-password-2026

do $$
declare
  fixture_instance_id uuid := '00000000-0000-0000-0000-000000000000';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values
    (fixture_instance_id, '11111111-1111-4111-8111-111111111111', 'authenticated', 'authenticated', 'beta-alex@example.test', crypt('beta-password-2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Alex Beta"}', now() - interval '10 days', now(), '', '', '', ''),
    (fixture_instance_id, '22222222-2222-4222-8222-222222222222', 'authenticated', 'authenticated', 'beta-bima@example.test', crypt('beta-password-2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Bima Beta"}', now() - interval '9 days', now(), '', '', '', ''),
    (fixture_instance_id, '33333333-3333-4333-8333-333333333333', 'authenticated', 'authenticated', 'beta-citra@example.test', crypt('beta-password-2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"display_name":"Citra Blocked"}', now() - interval '8 days', now(), '', '', '', '')
  on conflict (id) do update set
    email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values
    ('11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', '{"sub":"11111111-1111-4111-8111-111111111111","email":"beta-alex@example.test"}', 'email', 'beta-alex@example.test', now(), now(), now()),
    ('22222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', '{"sub":"22222222-2222-4222-8222-222222222222","email":"beta-bima@example.test"}', 'email', 'beta-bima@example.test', now(), now(), now()),
    ('33333333-3333-4333-8333-333333333333', '33333333-3333-4333-8333-333333333333', '{"sub":"33333333-3333-4333-8333-333333333333","email":"beta-citra@example.test"}', 'email', 'beta-citra@example.test', now(), now(), now())
  on conflict (provider_id, provider) do update set identity_data = excluded.identity_data, updated_at = now();
end $$;

insert into public.profiles (id, username, display_name, bio)
values
  ('11111111-1111-4111-8111-111111111111', 'beta_alex', 'Alex Beta', 'Mencatat film dan momen kecil sesudahnya.'),
  ('22222222-2222-4222-8222-222222222222', 'beta_bima', 'Bima Beta', 'Penonton malam, pencari cerita.'),
  ('33333333-3333-4333-8333-333333333333', 'beta_citra', 'Citra Blocked', 'Akun fixture untuk menguji pemblokiran.')
on conflict (id) do update set username = excluded.username, display_name = excluded.display_name, bio = excluded.bio;

insert into public.films (id, tmdb_id, title, original_title, release_date, poster_path, overview, original_language)
values
  ('a1111111-1111-4111-8111-111111111111', 27205, 'Inception', 'Inception', '2010-07-15', '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', 'A thief who enters dreams is offered a final chance at redemption.', 'en'),
  ('a2222222-2222-4222-8222-222222222222', 238, 'The Godfather', 'The Godfather', '1972-03-14', '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.', 'en'),
  ('a3333333-3333-4333-8333-333333333333', 372058, 'Your Name.', '君の名は。', '2016-08-26', '/q719jXXEzOoYaps6babgKnONONX.jpg', 'Two teenagers share a profound, magical connection.', 'ja'),
  ('a4444444-4444-4444-8444-444444444444', 346698, 'Barbie', 'Barbie', '2023-07-19', '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', 'Barbie and Ken leave Barbieland for the real world.', 'en')
on conflict (tmdb_id) do update set title = excluded.title, original_title = excluded.original_title, release_date = excluded.release_date, poster_path = excluded.poster_path, overview = excluded.overview, original_language = excluded.original_language;

insert into public.journals (id, author_id, film_id, watched_on, mood, rating, reaction, body, visibility, is_spoiler, moderation_status, created_at)
values
  ('b1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', current_date - 1, 'Excited', 4.5, 'Masih terpikir lapisan mimpi terakhirnya sampai perjalanan pulang.', 'Soundtrack dan ritmenya terasa seperti meminjam waktu.', 'public', false, 'active', now() - interval '1 day'),
  ('b2222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222', 'a2222222-2222-4222-8222-222222222222', current_date - 2, 'Moved', 5.0, 'Sebuah drama keluarga yang tenang tetapi meninggalkan gema panjang.', 'Menontonnya bersama keluarga membuat beberapa adegan terasa lebih dekat.', 'public', false, 'active', now() - interval '2 days'),
  ('b3333333-3333-4333-8333-333333333333', '22222222-2222-4222-8222-222222222222', 'a3333333-3333-4333-8333-333333333333', current_date - 3, 'Comforted', 4.5, 'Catatan ini sengaja privat untuk menguji akses pemilik saja.', 'Tidak boleh terlihat oleh Alex ketika memakai akun lain.', 'private', false, 'active', now() - interval '3 days'),
  ('b4444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'a4444444-4444-4444-8444-444444444444', current_date - 4, 'Amused', 4.0, 'Akhir cerita mengubah cara aku membaca semua detail sebelumnya.', 'Fixture spoiler: reaksi dan gambar harus ditutupi hingga pembaca memilih tampilkan.', 'public', true, 'active', now() - interval '4 days'),
  ('b5555555-5555-4555-8555-555555555555', '33333333-3333-4333-8333-333333333333', 'a4444444-4444-4444-8444-444444444444', current_date - 5, 'Disappointed', 2.5, 'Jurnal dari akun yang diblokir tidak boleh masuk feed Alex.', null, 'public', false, 'active', now() - interval '5 days')
on conflict (id) do update set reaction = excluded.reaction, body = excluded.body, visibility = excluded.visibility, is_spoiler = excluded.is_spoiler, moderation_status = excluded.moderation_status;

insert into public.follows (follower_id, following_id)
values
  ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222'),
  ('22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111')
on conflict do nothing;

insert into public.journal_likes (journal_id, user_id)
values
  ('b1111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222'),
  ('b2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111'),
  ('b4444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222')
on conflict do nothing;

insert into public.comments (id, journal_id, author_id, body, moderation_status)
values
  ('c1111111-1111-4111-8111-111111111111', 'b1111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Aku juga masih memikirkan adegan terakhirnya.', 'active'),
  ('c2222222-2222-4222-8222-222222222222', 'b2222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'Setuju, setiap diamnya terasa punya bobot.', 'active')
on conflict (id) do update set body = excluded.body, moderation_status = excluded.moderation_status;

insert into public.reports (id, reporter_id, target_type, target_id, reason, details, status)
values
  ('d1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111', 'journal', 'b5555555-5555-4555-8555-555555555555', 'unmarked_spoiler', 'Fixture laporan moderation untuk antrean admin.', 'open')
on conflict (id) do update set details = excluded.details, status = excluded.status;

insert into public.blocks (blocker_id, blocked_id)
values ('11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333')
on conflict do nothing;
