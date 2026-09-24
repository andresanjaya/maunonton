# PRD — maunonton: Mobile-First Social Film Journal

**Versi dokumen:** 1.2 · **Tanggal:** 23 September 2026 · **Status:** rancangan untuk desain dan implementasi

## 1. Ringkasan keputusan

maunonton adalah web app mobile-first yang dapat dipasang sebagai Progressive Web App (PWA) di Home Screen iPhone untuk membuat jurnal pengalaman menonton film berbasis foto pribadi dan membagikannya kepada orang lain. Unit utamanya adalah **journal**, bukan daftar film: satu film bisa mempunyai banyak journal dari pengguna berbeda dan seorang pengguna dapat membuat lebih dari satu journal untuk film yang sama pada tanggal menonton berbeda.

**Janji produk:** “Ingat filmnya. Simpan momennya. Ceritakan rasanya.”

**Descriptor brand:** *Social film journal untuk menyimpan apa yang kamu tonton dan bagaimana rasanya.*

**Hipotesis yang diuji v1:** pencinta film mau mencatat dan membagikan konteks pribadi saat menonton (mood, foto, reaksi), serta mau membaca pengalaman teman melalui feed. Ini hipotesis produk, bukan fakta riset pengguna yang sudah tervalidasi.

**Keputusan utama:** web app dahulu dengan pendekatan mobile-first PWA; Next.js dan TypeScript untuk frontend; Supabase untuk autentikasi, PostgreSQL, penyimpanan gambar, dan fungsi server; TMDB untuk metadata film. MVP tidak membutuhkan Apple Developer Program atau App Store. Setelah penggunaan tervalidasi, kode dan backend dapat menjadi dasar aplikasi native iOS. Peluncuran pertama gratis, tanpa iklan dan tanpa monetisasi agar selaras dengan ketentuan penggunaan nonkomersial TMDB. Konfirmasi ulang lisensi jika model bisnis berubah.

## 2. Nama dan identitas

- **Nama aplikasi yang direkomendasikan:** maunonton.
- **Display name:** MauNonton (untuk keterbacaan pada metadata dan pencarian); wordmark dapat menggunakan lowercase `maunonton`.
- **Deskripsi singkat:** A social film journal for the moments around movies.
- **Bahasa produk awal:** Indonesia; struktur data siap menerima bahasa lain.
- **Distribusi awal:** URL publik dan PWA; tidak ada pengajuan App Store pada MVP.
- **Status nama:** nama dagang, domain, username sosial, dan ketersediaan nama belum diverifikasi secara formal. Finalisasi sebelum membuat aset merek dan domain produksi.

Nama “maunonton” terdengar akrab bagi pengguna Indonesia dan mudah diucapkan. Karena frasa ini juga dapat memberi kesan aplikasi rekomendasi atau layanan streaming, gunakan descriptor yang konsisten: **maunonton — social film journal**. Landing page harus menjelaskan bahwa pengguna mencatat dan membagikan pengalaman menonton; aplikasi tidak memutar film. Pemeriksaan merek, domain, username, dan ketersediaan app listing tetap dilakukan sebelum rilis.

## 3. Masalah, pengguna, dan posisi produk

**Masalah:** informasi film mudah dicari dan rating mudah diberikan, tetapi kenangan pribadi di sekitar kegiatan menonton sering tersebar di galeri iPhone, chat, dan catatan. Pengguna membutuhkan satu tempat untuk menghubungkan film dengan foto, perasaan, tanggal, dan cerita; lalu membagikannya melalui format yang menyenangkan.

**Pengguna utama:** orang berusia dewasa yang rutin menonton film, suka memotret tiket/bioskop/momen menonton, dan nyaman membagikan catatan pribadi kepada teman. **Pengguna awal yang disarankan:** Andre dan 10–30 teman atau komunitas film yang bersedia membuat journal nyata selama uji beta. Jumlah ini target rekrutmen, bukan proyeksi pasar.

**Pekerjaan utama pengguna:**

1. Setelah menonton, saya ingin menyimpan reaksi dan foto agar momen tersebut mudah diingat.
2. Saya ingin melihat pengalaman teman menonton film tanpa harus membaca ulasan panjang.
3. Saya ingin mengendalikan bagian mana yang terlihat publik dan menghindari spoiler.

**Batas posisi:** film saja pada v1. Serial, episode, watchlist, rekomendasi algoritmik, dan rating agregat komunitas menyusul jika kebutuhan pengguna terbukti.

## 4. Tujuan, metrik, dan batas MVP

**Tujuan v1:** pengguna dapat menemukan film, menerbitkan journal yang berisi foto dan cerita, lalu mendapat interaksi dari pengguna lain dalam satu aplikasi iPhone.

**Metrik beta, dihitung pada pengguna yang benar-benar mendaftar:**

| Metrik | Definisi | Ambang evaluasi awal* |
| --- | --- | --- |
| Aktivasi | Pengguna baru yang menerbitkan journal pertama ≤7 hari setelah daftar | ≥40% |
| Penyelesaian journal | Sesi composer yang berakhir dengan journal berhasil diterbitkan | ≥60% |
| Penggunaan foto | Journal terbit yang menyertakan ≥1 foto milik pengguna | ≥50% |
| Retensi minggu 2 | Pembuat journal minggu 1 yang membuka aplikasi atau membuat journal lagi pada minggu 2 | ≥25% |
| Interaksi | Journal publik yang menerima like atau komentar dari akun lain ≤7 hari | ≥30% |
| Keamanan | Laporan konten yang ditangani dalam target internal yang ditetapkan | 100% |

\*Angka di atas **target eksperimen**, bukan benchmark industri. Tinjau setelah beta; sampel kecil tidak membuktikan product-market fit.

**Termasuk v1:** akun, profil, pencarian film, composer journal, foto 0–5, mood, rating opsional, tanggal menonton, visibilitas publik/pribadi, spoiler, feed Following dan Explore terbaru, detail journal, like, komentar satu tingkat, follow, pelaporan konten, blokir pengguna, moderasi admin, hapus akun.

**Sesudah v1:** watchlist, simpan journal, foto sampul/layout scrapbook yang bisa dikustom, kartu review Instagram, rekap tahunan, grafik mood, notifikasi push, DM, grup, video, seri TV, lokasi presisi, tag bebas, rekomendasi personal, sinkronisasi Letterboxd, dan monetisasi. Recap dan kartu Instagram adalah bagian dari visi, **bukan janji rilis v1**.

## 5. Prinsip pengalaman dan navigasi

- Feed menonjolkan foto pengguna dan cuplikan cerita; poster TMDB membantu mengenali film.
- Pembuatan journal dapat selesai dalam kurang dari tiga menit pada koneksi normal; ini target desain yang perlu diuji, bukan jaminan performa.
- Pengguna selalu melihat apakah journal akan **Publik** atau **Pribadi** sebelum menerbitkan.
- Spoiler disembunyikan di feed dan detail sampai pembaca memilih membukanya.
- Antarmuka bernuansa film dan editorial, tetapi teks, tombol, dan isyarat status tetap mudah dibaca.

**Tab iPhone:** Home · Explore · Create · Profile. Create dapat menjadi tombol tengah. Layar pengaturan, laporan, dan detail berada di dalam tab terkait. Tidak perlu tab Saved pada v1.

| Layar | Isi dan tindakan utama |
| --- | --- |
| Welcome / Auth | Penjelasan singkat, daftar/login email, pemulihan akses |
| Home | Segmen Following dan Explore; kartu journal, like, komentar, status spoiler |
| Explore | Cari film atau pengguna; daftar journal publik terbaru; empty state |
| Film detail | Poster, judul, tahun, sinopsis singkat dari TMDB, journal publik terkait, tombol Buat journal |
| Create / Edit journal | Pilih film, tanggal, mood, reaksi, isi, rating, tambah/urut/hapus foto, spoiler, visibilitas, pratinjau, terbit/simpan perubahan |
| Journal detail | Foto, cerita, metadata film, like, komentar, menu report/block milik pembaca, menu edit/hapus milik penulis |
| Profile | Avatar, nama, username, bio, jumlah journal, feed journal publik, follow/unfollow |
| Settings & safety | Edit profil, bantuan/kontak, pedoman komunitas, kebijakan privasi, ketentuan, About/Credits TMDB, hapus akun |
| Moderation admin | Antrean laporan, konten terkait, alasan, riwayat tindakan, hapus/sembunyikan konten, status laporan |

**Alur inti:** Daftar → lengkapi username → cari film → pilih film → isi journal → pilih foto → tinjau spoiler dan visibilitas → terbitkan → tampil di profil dan feed yang berhak melihat → pengguna lain dapat like/komentar/follow/report/block.

## 6. Kebutuhan fungsional dan kriteria penerimaan

### F01 — Akun dan profil (P0)

- Email dan kata sandi dengan verifikasi email; login, logout, reset kata sandi. Username unik dan dapat diedit dengan pembatasan perubahan yang ditentukan saat implementasi.
- Avatar dan bio opsional. Email tidak tampil pada profil publik.
- Pengguna dapat menghapus akun dari Settings; alur menjelaskan konsekuensi dan memproses penghapusan data jurnal, media, interaksi, serta relasi akun sesuai kebijakan retensi yang dipublikasikan.
- **Diterima jika:** akun baru dapat membuat profil; reset bekerja; pemilik dapat memulai penghapusan dari dalam aplikasi; akun yang terhapus tidak lagi memiliki konten publik.

### F02 — Pencarian dan metadata film (P0)

- Pencarian judul film melalui TMDB dengan penundaan input (debounce), hasil berisi judul, tahun, dan poster bila tersedia. Detail film diambil saat dibuka/dipilih.
- Gunakan ID TMDB sebagai identitas eksternal yang stabil. Simpan snapshot metadata seperlunya (judul, tahun, poster path, original language) untuk kecepatan tampilan; metadata dapat diperbarui.
- Hasil kosong, film tanpa poster, timeout, dan API tidak tersedia ditangani jelas. Jika pencarian gagal sementara, draft composer tidak hilang.
- **Diterima jika:** judul yang dipilih tersimpan pada journal yang benar dan tidak tertukar dengan film berjudul sama/tahun berbeda.

### F03 — Composer journal (P0)

- **Wajib:** film, tanggal menonton, reaksi/isi minimal 10 karakter, satu mood dari pilihan terbatas. **Opsional:** rating 0,5–5 bintang dalam langkah 0,5; 0–5 gambar; catatan pendek pendamping foto.
- Jenis gambar: JPEG, PNG, HEIC/HEIF bila konversi perangkat mendukung. Batas awal: maksimum 5 gambar; kompres/resize sebelum unggah, maksimum hasil 5 MB per gambar, dimensi target maksimum 2048 piksel sisi terpanjang. Batas dapat direvisi setelah pengukuran penggunaan.
- Foto dapat diurutkan dan dihapus sebelum/selepas terbit. Foto pertama menjadi cover jika ada; jika tidak, gunakan poster film.
- Visibilitas **Publik** atau **Pribadi**, default **Pribadi** saat journal pertama agar pengguna memilih secara sadar; pilihan berikutnya jangan diam-diam mengubah privasi. Publik terlihat di Explore/profil/feed; privat hanya pemilik.
- Pilihan **Mengandung spoiler** default mati; ketika aktif, teks reaksi/isi dan gambar journal tertutup hingga pembaca menekan “Tampilkan spoiler”. Poster dan judul film tetap terlihat.
- Draft lokal disimpan sementara saat composer ditinggalkan/terputus. Publikasi menunggu semua upload berhasil; kegagalan tidak menghasilkan journal parsial yang terlihat publik.
- **Diterima jika:** pengguna dapat membuat, mengedit, dan menghapus journal; urutan foto konsisten; journal privat tidak dapat dibuka oleh akun lain walaupun mengetahui ID/URL.

### F04 — Feed dan discovery (P0)

- **Following:** journal publik terbaru dari akun yang diikuti. **Explore:** journal publik terbaru dari komunitas; urutan kronologis pada v1.
- Gunakan pagination berbasis cursor, bukan mengambil seluruh journal. Beri empty state dengan ajakan mengikuti pengguna atau membuat journal.
- Tampilkan avatar, username, film, tanggal menonton, mood, rating bila ada, cover foto/poster, cuplikan teks, jumlah like/komentar.
- **Diterima jika:** journal privat, journal yang disembunyikan moderator, dan journal dari akun yang diblokir tidak muncul dalam feed yang tidak berhak.

### F05 — Interaksi sosial (P0)

- Follow/unfollow akun publik; satu like per pengguna per journal; komentar teks satu tingkat. Pemilik komentar dapat menghapus komentarnya, pemilik journal dapat menyembunyikan/menghapus komentar di journal miliknya sesuai aturan komunitas.
- Tidak ada DM atau mention pengguna pada v1. Angka like/komentar berasal dari data server, bukan nilai yang dipercaya dari aplikasi.
- **Diterima jika:** like/follow berulang tidak menciptakan duplikasi; blokir memutus hubungan follow dan mencegah interaksi selanjutnya.

### F06 — Moderasi dan keamanan (P0, syarat rilis sosial)

- Tombol **Laporkan** pada journal, komentar, dan profil; alasan: pelecehan, spam, konten tidak pantas, hak cipta, spoiler tanpa label, lainnya. Status laporan disimpan untuk admin.
- Tombol **Blokir pengguna** pada profil dan konten. Setelah blokir, akun saling tidak melihat konten/interaksi satu sama lain dalam aplikasi; definisi rinci diuji pada level query dan akses langsung.
- Filter teks dasar (spam/istilah terlarang) sebelum publikasi dan mekanisme tinjauan/penahanan gambar yang dilaporkan; aturan otomatis tidak menggantikan peninjauan manusia. Admin dapat menyembunyikan journal/komentar, menonaktifkan akun, mencatat alasan dan waktu tindakan. Publikasikan kontak dukungan dan aturan komunitas.
- **Diterima jika:** laporan dapat dikirim, muncul di antrean admin, diputuskan, dan konten berbahaya dapat segera disembunyikan; akun yang diblokir tidak dapat berkomentar atau mengikuti pemblokir.

## 7. Aturan konten dan privasi

- **Foto pengguna:** arahkan pengguna mengunggah foto yang dibuat sendiri atau yang hak penggunaannya dimiliki. Foto tiket, teman (dengan izin), bioskop, dan momen menonton cocok untuk produk. Tangkapan adegan film, poster hasil unggahan pengguna, dan gambar orang lain dapat menimbulkan klaim hak cipta; sediakan pelaporan dan penghapusan. Poster dari TMDB tampil sebagai metadata dengan atribusi sesuai ketentuannya, bukan disalin ke bucket unggahan pengguna.
- **Lokasi:** tidak kumpulkan GPS atau lokasi presisi pada v1. Informasi bioskop dapat ditulis sendiri dalam isi journal jika pengguna menghendaki.
- **Akses foto:** gunakan pemilih foto sistem; minta izin hanya bila fungsi memerlukannya. Jangan minta akses kamera/mikrofon untuk unggah foto galeri.
- **Data pribadi:** email dan data auth tersimpan di layanan auth; hanya avatar, nama tampilan, username, bio, dan journal publik yang terlihat pengguna lain. Jangan masukkan kunci rahasia atau data pribadi pada analytics.
- **Kebijakan:** siapkan Privacy Policy, Terms of Use, Community Guidelines, halaman dukungan/kontak, proses permintaan penghapusan, dan pengungkapan praktik data untuk App Store sebelum pengajuan.

## 8. Arsitektur dan rekomendasi bahasa pemrograman

**Pilihan:** **TypeScript** untuk frontend dan fungsi server; SQL/PostgreSQL untuk database. Next.js sesuai dengan pengalaman Andre, mendukung responsive UI, metadata/share pages, server-side logic, dan deployment web. PWA menambahkan manifest, ikon, standalone display, service worker, cache dasar, dan install prompt agar web app terasa seperti aplikasi di iPhone.

| Lapisan | Pilihan | Tanggung jawab |
| --- | --- | --- |
| Frontend web | Next.js App Router, React, TypeScript | UI mobile-first, routing, feed, composer, profile, responsive layout |
| Styling | Tailwind CSS atau CSS Modules | Design tokens, safe-area spacing, dark/light theme bila diperlukan |
| PWA | Web App Manifest, Service Worker, Workbox atau library setara | Install ke Home Screen, cache shell, draft lokal, offline fallback |
| Data jarak jauh | Supabase PostgreSQL | Profil, film terpilih, journal, likes, komentar, follows, laporan |
| Akun | Supabase Auth | Verifikasi email, sesi, reset kata sandi, penghapusan akun |
| Media | Supabase Storage | Avatar dan foto journal dengan kebijakan akses |
| Server logic | Next.js Route Handlers/Server Actions atau Supabase Edge Functions | Proxy TMDB, validasi upload, moderasi, penghapusan akun, operasi yang membutuhkan rahasia |
| Sumber film | TMDB API v3 | Pencarian, detail, poster path; tidak menjadi database sosial |
| Hosting | Vercel atau platform Node.js setara | HTTPS, deployment, environment variables, preview builds |

**Mengapa bukan React Native pada tahap ini:** web app dapat langsung dipakai dari URL, diuji di iPhone dan Android, diperbarui tanpa App Store review, serta tidak membutuhkan Apple Developer Program. Next.js juga memberi jalur yang lebih singkat dari pengalaman Andre saat ini. Setelah kebutuhan native terbukti, frontend dapat diimplementasikan ulang memakai Expo/React Native dengan Supabase backend yang sama.

**Batas PWA di iPhone:** pemilih foto dan upload berjalan melalui Safari; install dilakukan melalui “Add to Home Screen”. PWA tidak memiliki seluruh kemampuan aplikasi native, sehingga MVP tidak menjanjikan integrasi mendalam seperti background processing, widget iOS, atau native share sheet. Web push pada Home Screen dapat ditambahkan setelah alur inti stabil dan kompatibilitas perangkat diuji.

**Alasan proxy TMDB:** token TMDB jangan dipasang sebagai rahasia di browser publik. Route Handler/server function menerima query pengguna, membatasi input/rate, memanggil TMDB dengan credential server, dan mengembalikan field yang diperlukan. Supabase publishable/anon key boleh berada di browser hanya jika seluruh tabel dan storage dilindungi oleh Row Level Security (RLS); **service role key selalu di server**.

**Pola media:** browser mengecilkan foto bila memungkinkan → server memvalidasi jumlah/tipe/ukuran → upload ke bucket → database menyimpan path, urutan, dan dimensi. Konten privat memerlukan bucket privat dan akses terkontrol/signed URL atau mekanisme setara; jangan memakai URL publik yang mengabaikan status privat.

**Operasional awal:** satu environment development dan satu production; migrasi SQL berversi, backup sesuai paket yang dipilih, preview deployment untuk pull request, serta monitor error aplikasi, pemakaian storage/bandwidth, antrean laporan, dan error TMDB. Cek batas serta harga penyedia pada saat akun dibuat karena paket dapat berubah.

## 9. Asal data film dan lisensi

**TMDB** menyediakan pencarian film (`/3/search/movie`), detail film, dan path poster. Contoh: pengguna mengetik “Past Lives” → aplikasi memanggil proxy → hasil TMDB menampilkan judul/tahun/poster → pengguna memilih film → `tmdb_id` dan metadata minimum disimpan bersama journal. Pencarian dapat menggunakan parameter bahasa `id-ID`, dengan fallback tampilan judul asli jika terjemahan kosong.

API TMDB **gratis untuk penggunaan nonkomersial dengan atribusi**. TMDB menyatakan proyek yang tujuan utamanya menghasilkan pendapatan untuk pemilik sebagai komersial dan meminta calon pengguna komersial menghubungi mereka untuk lisensi. Untuk v1 gratis tanpa iklan, tetap periksa syarat terbaru sebelum rilis; jika akan menambah iklan, langganan, atau sponsor, urus lisensi dan penilaian komersial terlebih dahulu.

Di halaman **About/Credits**, tampilkan logo TMDB resmi dan kalimat atribusi yang diminta: “This product uses the TMDB API but is not endorsed or certified by TMDB.” Cantumkan tautan TMDB. Jangan menampilkan poster pengguna sebagai milik maunonton. Simpan `tmdb_id` agar journal tidak hilang saat API lambat; sediakan placeholder jika poster atau metadata tidak tersedia.

**Sumber resmi:** https://developer.themoviedb.org/docs/faq · https://developer.themoviedb.org/reference/search-movie · https://developer.themoviedb.org/docs/image-basics

## 10. Rancangan database awal

Semua ID internal gunakan UUID, semua waktu simpan UTC, tanggal menonton gunakan `date` berdasarkan pilihan pengguna. Indeks dibuat pada kolom filter/feed. Skema rinci dan migration ditulis saat implementasi.

| Tabel | Kolom inti | Aturan dan indeks |
| --- | --- | --- |
| `profiles` | `id` (FK auth.users), `username`, `display_name`, `bio`, `avatar_path`, `created_at` | username unik dan case-insensitive; email tidak disalin ke tabel publik |
| `films` | `id`, `tmdb_id`, `title`, `original_title`, `release_date`, `poster_path`, `updated_at` | `tmdb_id` unik; cache metadata terpilih, bukan dump seluruh TMDB |
| `journals` | `id`, `author_id`, `film_id`, `watched_on`, `mood`, `rating`, `reaction`, `body`, `visibility`, `is_spoiler`, `moderation_status`, `created_at`, `updated_at` | indeks feed publik `(created_at, id)` dan profil `(author_id, created_at)`; rating `NULL` atau 0.5–5 dalam langkah 0.5 |
| `journal_images` | `id`, `journal_id`, `storage_path`, `sort_order`, `width`, `height`, `created_at` | maksimum 5 per journal via transaksi/fungsi server; urutan unik per journal |
| `follows` | `follower_id`, `following_id`, `created_at` | pasangan unik; tidak boleh follow diri sendiri |
| `journal_likes` | `journal_id`, `user_id`, `created_at` | pasangan unik |
| `comments` | `id`, `journal_id`, `author_id`, `body`, `moderation_status`, `created_at` | satu tingkat; indeks `(journal_id, created_at)` |
| `blocks` | `blocker_id`, `blocked_id`, `created_at` | pasangan unik; atur efeknya di query + kebijakan akses |
| `reports` | `id`, `reporter_id`, `target_type`, `target_id`, `reason`, `details`, `status`, `created_at`, `resolved_at` | hanya pelapor dan admin berhak membaca; validasi bahwa target benar-benar ada |
| `moderation_actions` | `id`, `report_id`, `moderator_id`, `action`, `notes`, `created_at` | audit keputusan admin; tidak publik |

**Aturan akses (RLS):** journal publik dan aktif dapat dibaca sesuai aturan blokir; journal privat hanya pemilik dan admin berwenang; pemilik mengubah/menghapus miliknya; likes/comments/follows hanya oleh akun terautentikasi yang diizinkan; report hanya pembuat dan admin; storage path diikat pada pemilik/journal yang sah. Validasi ganda di server diperlukan untuk interaksi lintas tabel; RLS tidak boleh bergantung pada penyaringan UI saja. Uji akses anonim dan lintas akun sebelum beta.

## 11. Definisi kualitas dan pengujian penerimaan

- **Kinerja:** gambar memakai thumbnail/ukuran responsif, lazy loading, pagination; target feed pertama tampil <3 detik pada jaringan uji yang ditetapkan tim (ukur perangkat dan jaringan nyata).
- **Aksesibilitas:** target sentuh memadai, label VoiceOver, urutan fokus logis, kontras teks, Dynamic Type sejauh layout mendukung, status spoiler tidak hanya warna.
- **Ketahanan:** journal draft bertahan saat aplikasi ditutup; upload gagal dapat dicoba lagi; double tap Publish tidak menggandakan journal; sesi kedaluwarsa memberi jalan masuk ulang.
- **Keamanan:** RLS dan Storage policies diuji dari dua akun; rate limit untuk pencarian, komentar, like dan report; sanitasi konten teks; pemeriksaan file upload; tidak ada token admin/TMDB dalam binary.
- **Uji skenario:** akun A membuat journal privat dan publik; akun B mencari, mengikuti, like, komentar, report, block; akun C mencoba mengakses ID privat langsung; admin menyembunyikan konten; pemilik menghapus foto, journal, lalu akun; data yang seharusnya hilang tidak lagi dapat diakses.

## 12. Tahapan pengerjaan dan keluaran

| Tahap | Keluaran | Syarat lanjut |
| --- | --- | --- |
| 0. Validasi cepat | 5–8 wawancara singkat, contoh journal dan prototipe composer mobile, uji pemahaman nama/nilai foto | Pengguna mengerti alasan membuat journal dan visibilitasnya |
| 1. Fondasi web | Design system mobile-first, Next.js, routing, PWA manifest, auth, skema/migration, RLS dasar, proxy TMDB | Cari/pilih film dan masuk akun berjalan di browser mobile |
| 2. Journal | Composer responsif, photo picker, kompresi, draft lokal, edit/hapus, privat/publik, spoiler | Alur publish tanpa duplikasi dan akses privat aman di iPhone Safari |
| 3. Sosial + keselamatan | Feed, profil, follow, like, komentar, report, block, admin moderation | Alur dua akun dan moderasi lulus uji |
| 4. Beta web/PWA | Deployment HTTPS, domain, install Home Screen, analytics privasi-minimal, error monitoring, policy/support, tester | Kriteria rilis di bawah terpenuhi |
| 5. Keputusan native | Review metrik 2–4 minggu, masalah PWA, kebutuhan native, dan biaya | Hanya lanjut ke Expo/iOS bila ada alasan penggunaan yang jelas |

**Definition of done v1:** alur utama berjalan di Safari iPhone dan browser Android; PWA dapat di-install; tidak ada akses tidak sah ke journal privat; laporan bisa diproses; akun dapat dihapus; identitas TMDB benar; halaman legal/support tersedia; deployment HTTPS stabil; beta menghasilkan umpan balik tentang nilai foto dan penggunaan feed.

## 13. Cara publish web app dan memasangnya di iPhone

### 13.1 Deployment MVP

1. Buat repository Next.js TypeScript dengan environment `development` dan `production`.
2. Buat project Supabase, jalankan migration, aktifkan RLS, buat bucket media, dan simpan credential server sebagai environment variable.
3. Daftarkan TMDB API key; panggil TMDB melalui server route, bukan langsung dari browser dengan secret key.
4. Deploy ke Vercel atau hosting Node.js setara dengan HTTPS dan domain produksi.
5. Tambahkan `manifest.webmanifest`, ikon 180/192/512 px, `apple-touch-icon`, metadata theme color, `display: standalone`, dan service worker.
6. Uji responsive layout pada ukuran iPhone kecil, iPhone besar, Android, dan desktop. Uji juga upload HEIC/JPEG, koneksi lambat, refresh saat draft, orientation, notch/safe area, keyboard, dan deep link.
7. Bagikan URL beta kepada tester. Catat browser, perangkat, error upload, dan apakah pengguna memasang PWA.

### 13.2 Cara pengguna memasang di iPhone

1. Buka URL maunonton melalui Safari.
2. Tekan tombol Share.
3. Pilih **Add to Home Screen**.
4. Tekan Add.
5. Buka maunonton dari ikon Home Screen agar tampil dalam mode standalone.

Web push dapat dipertimbangkan kemudian untuk PWA yang sudah dipasang; Apple mendukung web push untuk Home Screen web apps pada iOS 16.4 atau lebih baru. Uji permission dan fallback karena fitur ini bergantung pada dukungan browser/perangkat.

### 13.3 Kapan masuk App Store

MVP tidak perlu Apple Developer Program, TestFlight, atau App Store. Pertimbangkan versi native setelah ada bukti bahwa pengguna memakai produk dan ada kebutuhan yang tidak dapat dipenuhi PWA, misalnya share sheet native, widget, integrasi foto yang lebih dalam, notifikasi yang lebih konsisten, atau performa media.

Jika masuk App Store kemudian:

1. Migrasikan frontend ke Expo/React Native secara bertahap; pertahankan Supabase dan model data yang sama bila memungkinkan.
2. Daftar Apple Developer Program; biaya standar yang diumumkan Apple adalah USD 99 per tahun atau mata uang lokal jika tersedia.
3. Gunakan EAS Build/Submit dari Windows untuk membangun di macOS cloud, uji melalui TestFlight, lalu lengkapi App Store metadata, privacy policy URL, support URL, App Privacy, age rating, dan moderation flow.
4. Jangan mengirim wrapper website yang hanya membuka URL. Apple menilai minimum functionality dan kualitas pengalaman aplikasi; versi native harus memberikan pengalaman dan fungsi yang benar-benar layak sebagai aplikasi.

**Kepatuhan tetap berlaku untuk web beta:** pedoman komunitas, report, block, kontak dukungan, penghapusan akun, dan takedown konten tetap perlu tersedia karena maunonton adalah layanan sosial dengan unggahan pengguna.

**Sumber resmi:** https://developer.apple.com/app-store/review/ · https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers · https://developer.apple.com/programs/enroll/ · https://docs.expo.dev/build/introduction/ · https://docs.expo.dev/submit/ios/

## 14. Risiko, keputusan, dan hal yang perlu dibuktikan

| Risiko | Dampak | Respons v1 |
| --- | --- | --- |
| Foto membuat biaya storage/bandwidth meningkat | Biaya operasi dan loading | Maksimum 5 gambar, kompresi, thumbnail, metrik penggunaan |
| Pengguna mengunggah adegan/arsip film tanpa hak | Keluhan IP, penghapusan konten | Pedoman unggah, report, takedown, foto pribadi sebagai contoh utama |
| Konten berbahaya dan spam | Keamanan dan penolakan review | Filter dasar, report, block, antrean admin, rate limit |
| Feed kosong saat komunitas kecil | Aktivasi dan retensi rendah | Explore journal terbaru, onboarding contoh dari akun nyata dengan izin, rekrut beta bersama teman |
| TMDB tidak tersedia/lisensi berubah | Pencarian dan kelayakan komersial | Snapshot metadata film terpilih, error state, cek syarat sebelum monetisasi |
| Privasi foto/journal bocor | Kehilangan kepercayaan | Bucket privat, RLS, uji dua akun, audit URL dan akses langsung |
| Nama memberi ekspektasi watchlist | Salah memahami produk | Uji nama dan pesan onboarding; siapkan opsi rebrand |

**Keputusan sebelum final desain:** mood awal (usulan: excited, moved, comforted, unsettled, amused, disappointed); apakah rating opsional cukup jelas; apakah satu journal boleh tampil tanpa foto (usulan: ya agar tidak memaksa unggah); apakah profil publik dapat dilihat tanpa login (usulan v1: hanya dalam aplikasi dengan akun); siapa moderator beta dan target waktu respons laporan.

## 15. Daftar kerja pertama untuk Andre

1. Tunjukkan 3 contoh kartu journal dan composer kepada 5–8 calon pengguna; cari tahu apakah mereka akan memakai foto pribadi dan apa yang enggan mereka tampilkan.
2. Desain 8 layar inti mobile-first: Welcome, Home, Explore, Film detail, Create, Journal detail, Profile, Settings & safety; sertakan privat/publik, spoiler, loading, error, dan empty state.
3. Daftarkan akun TMDB dan Supabase development; buat repository Next.js TypeScript, PWA manifest, dan migrasi database awal.
4. Bangun alur satu pengguna membuat journal terlebih dahulu, kemudian uji dua akun, feed, moderasi, dan instalasi Home Screen sebelum undang beta.
5. Finalisasi nama dan aset, deploy web app HTTPS, buat halaman legal/support, lalu ukur penggunaan selama beta sebelum memutuskan versi native iOS.

---

**Catatan sumber dan status:** Informasi kebijakan, biaya, serta platform diperiksa pada 23 September 2026 dari sumber resmi Apple, Expo, TMDB, dan Supabase. Ketentuan ini dapat berubah; periksa ulang saat deployment, ketika mengubah monetisasi, dan jika maunonton masuk App Store. Angka target, skema, dan lingkup fitur di dokumen ini adalah keputusan produk yang diusulkan, bukan klaim dari penyedia tersebut.

**Referensi teknis tambahan:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs · https://supabase.com/docs/guides/getting-started/api-keys · https://supabase.com/docs/guides/storage
