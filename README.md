# maunonton

maunonton adalah jurnal film sosial mobile-first: bukan layanan streaming, melainkan tempat menyimpan film yang ditonton, perasaan sesudahnya, dan momen di sekitarnya.

## Menjalankan aplikasi

Gunakan Node.js **20.9 atau lebih baru** (disarankan Node 22 LTS), lalu instal dependensi dan mulai server pengembangan.

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`. Untuk menjalankan PWA secara lokal, gunakan browser HTTPS-compatible atau localhost; service worker akan terdaftar otomatis.

## Environment variables

Salin `.env.example` ke `.env.local`. File `.env.local` diabaikan Git dan tidak boleh dibagikan.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Server-only. Never prefix these with NEXT_PUBLIC_.
TMDB_API_KEY=YOUR_TMDB_API_KEY
TMDB_API_BASE_URL=https://api.themoviedb.org/3
SUPABASE_SERVICE_ROLE_KEY=
SUPPORT_EMAIL=support@example.com
ADMIN_USER_IDS=
```

`TMDB_API_KEY` hanya dibaca oleh `/api/tmdb/search`; browser tidak menerima key tersebut. `SUPABASE_SERVICE_ROLE_KEY` hanya diperlukan untuk operasi server/admin tertentu dan tidak boleh digunakan di browser.

## Supabase migrations

Instal Supabase CLI, masuk ke proyek, dan tautkan project bila menggunakan instance hosted:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push --dry-run
npx supabase db push
```

Untuk stack lokal, inisialisasi sekali lalu mulai Supabase. `db reset` menjalankan migration dalam urutan timestamp dan `supabase/seed.sql` setelahnya.

```bash
npx supabase init
npx supabase start
npm run db:seed
```

Jangan menjalankan seed lokal pada database produksi/hosted. Fixture memasukkan baris ke `auth.users` agar login fixture bekerja, sehingga ditujukan khusus untuk database pengembangan yang dapat direset.

## Seed development data

Seed menyediakan empat film, lima jurnal (publik, privat, spoiler, dan jurnal dari akun yang diblokir), komentar, follow, like, block, serta laporan moderation terbuka.

| Account | Email | Password | Purpose |
| --- | --- | --- | --- |
| Alex Beta | `beta-alex@example.test` | `beta-password-2026` | Akun utama; mengikuti Bima dan memblokir Citra. |
| Bima Beta | `beta-bima@example.test` | `beta-password-2026` | Akun utama kedua; memiliki jurnal privat. |
| Citra Blocked | `beta-citra@example.test` | `beta-password-2026` | Fixture konten yang tidak boleh terlihat oleh Alex. |

Gunakan `npm run db:seed` setelah `npx supabase start`. UUID fixture bersifat deterministik agar query RLS dan referensi laporan dapat diulang.

## Menguji autentikasi

1. Jalankan seed lokal dan buka `/login`.
2. Masuk sebagai Alex, refresh halaman, dan pastikan sesi tetap ada.
3. Keluar, lalu masuk sebagai Bima.
4. Saat logout, buka `/create` atau `/profile`; aplikasi harus mengarahkan pengguna ke login.
5. Untuk menguji signup nyata, gunakan email baru di `/register`, selesaikan verifikasi email, lalu isi username di `/onboarding/profile`.

Sebelum menguji email produksi, atur Supabase Authentication URL Configuration dengan Site URL dan callback `/auth/confirm`.

## Menguji akses jurnal privat dan block

1. Login sebagai Bima dan catat jurnal privat fixture `Your Name.` di profilnya.
2. Logout, login sebagai Alex, lalu buka feed Explore dan profil Bima. Jurnal privat tidak boleh terlihat atau bisa dibaca lewat URL.
3. Sebagai Alex, jurnal Citra tidak boleh muncul di Explore, komentar, atau pencarian/profil karena Citra sudah diblokir.
4. Login sebagai Bima untuk melihat jurnal publik Alex dan menguji follow, like, serta komentar.

## Menguji upload gambar

1. Login, buka `/create`, pilih film, isi tanggal, mood, dan reaksi minimal 10 karakter.
2. Tambahkan JPEG/PNG (atau HEIC bila browser mendukung), ubah urutan, lalu simpan sebagai publik dan privat.
3. Pastikan progres upload tampil dan foto privat tidak dapat dimuat dari sesi pengguna lain.
4. Nonaktifkan jaringan sebelum submit untuk memastikan draft masih dapat dipulihkan setelah reload.

Bucket `journal-images` bersifat private. Jangan pernah mengganti bucket menjadi public untuk mengatasi error gambar; perbaiki policy atau signed URL server-side bila diperlukan.

## Menguji moderation

1. Seed membuat laporan terbuka dari Alex terhadap jurnal Citra.
2. Set `ADMIN_USER_IDS` ke UUID admin yang sesuai, kemudian login sebagai pengguna itu dan buka `/admin/moderation`.
3. Ubah jurnal menjadi `under_review`, `hidden`, atau kembali `active`; jurnal hidden tidak boleh berada di feed publik.
4. Dari jurnal, komentar, atau profil, pilih Laporkan dan pastikan laporan kedua pada target yang sama ditolak selama laporan pertama masih `open` atau `reviewing`.

## Membangun PWA

```bash
npm run lint
npm run build
npm run start
```

Manifest ada di `app/manifest.ts`; ikon 180/192/512 dan Apple touch icon dirender oleh route aplikasi. Service worker hanya menyimpan shell offline dan ikon, bukan respons API, jurnal, atau gambar Storage privat. Uji install di Chrome/Edge melalui prompt instalasi; di Safari iPhone gunakan **Bagikan → Tambahkan ke Layar Utama**.

Untuk cek layout, gunakan DevTools pada lebar 320, 375, 390, 430, 768, dan 1280px. Pastikan bottom navigation terlihat, tidak ada horizontal overflow, composer tetap dapat dijangkau di atas keyboard, dan gambar mempertahankan rasio aspek.

## RLS smoke checks

Di SQL Editor, periksa bahwa RLS aktif dan kebijakan terpasang:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
```

Verifikasi khususnya bahwa `reports` tidak bisa dibaca role `anon`/`authenticated`, jurnal dan media privat hanya dapat dibaca author, serta relasi block menghilangkan follow dua arah dan menyaring konten terkait.

## Private production beta deployment

Supabase is a separate hosted service; it is not deployed to Vercel. Vercel deploys this Next.js application and connects to Supabase using environment variables.

### Vercel Production variables

In **Vercel ? Project ? Settings ? Environment Variables**, add these values to **Production** (and separately to Preview if testers use preview URLs):

| Variable | Required | Visibility |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Browser-safe project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Browser-safe only with RLS enabled. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Exact `https://` production domain. |
| `TMDB_API_KEY` | Yes | Server-only; never prefix with `NEXT_PUBLIC_`. |
| `TMDB_API_BASE_URL` | Yes | `https://api.themoviedb.org/3`. |
| `SUPPORT_URL` or `SUPPORT_EMAIL` | Yes | Public support destination. |
| `ADMIN_USER_IDS` | Optional | Comma-separated Supabase user UUIDs. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only; add only if using server admin actions. |

Do not commit `.env.local`, database URLs, passwords, TMDB keys, service-role keys, or Vercel tokens. Vercel environment changes apply only to new deployments, so redeploy after editing them.

### Supabase production setup

1. Run `npx supabase db push` from the linked repository to apply every migration, including private-beta hardening and film selection.
2. In Supabase Dashboard ? Authentication ? URL Configuration, set **Site URL** to the exact production domain and add:
   - `https://YOUR_DOMAIN/auth/confirm`
   - `https://YOUR_DOMAIN/reset-password`
   - `http://localhost:3000/**` for local development only
   - the exact Vercel preview pattern only if preview auth testing is needed.
3. In Storage, confirm `journal-images` is private. Do not add a public bucket policy.
4. Test a signed-out visitor, journal author, another user, and a blocked user against public/private journal and image URLs.

### Production smoke test

- Confirm `https://YOUR_DOMAIN/manifest.webmanifest`, `/sw.js`, `/apple-icon`, and `/pwa/icon-192` return over HTTPS.
- Install from Chrome/Edge; on iPhone Safari use **Share ? Add to Home Screen**.
- Register, verify email, reset password, logout, and login again.
- Verify a public journal share URL includes a film title and poster preview; a private journal must not disclose title, reaction, or image metadata in its preview.
- Create a private journal with an image, then confirm another account cannot load the page or signed image.
