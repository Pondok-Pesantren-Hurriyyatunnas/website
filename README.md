# Website Pondok Pesantren Hurriyyatunnas Bakti Awo

Website dinamis berbasis **Next.js + Payload CMS**:

- **MongoDB** menyimpan semua konten: berita, galeri, isi halaman, info PSB, dan data pendaftar.
- **S3 IDCloudHost** menyimpan foto yang diupload.
- **Dashboard admin** ada di `/admin`. Semua isi website diatur dari sini, tanpa menyentuh kode.
- **Pendaftaran santri baru (PSB)** dilakukan langsung lewat formulir di website. Datanya masuk ke dashboard dan bisa diekspor ke CSV/Excel.
- Hosting di **Vercel**.

## Isi dashboard admin

| Menu | Isi |
|---|---|
| Konten › Berita | Tulis berita: draft/terbit, kategori, gambar utama, isi |
| Konten › Galeri | Foto kegiatan dan fasilitas |
| Konten › Media | Semua gambar yang diupload (tersimpan di S3) |
| PSB › Pendaftar PSB | Data pendaftar dari formulir website. Ubah status, beri catatan, ekspor CSV lewat tombol ⋮ |
| PSB › Info PSB | Buka/tutup pendaftaran, tahun ajaran, pilihan jenjang, alur, syarat, jadwal, biaya |
| Halaman Website › Beranda / Profil / Program / Info Pondok & Kontak | Semua teks dan foto di halaman-halaman tersebut |
| Pengaturan › Akun Admin | Kelola akun (khusus peran Admin) |

**Peran akun:**
- **Admin**: akses penuh.
- **Editor**: kelola konten website, tidak bisa melihat data pendaftar.
- **Panitia PSB**: hanya kelola pendaftar dan Info PSB.

Akun pertama yang dibuat otomatis menjadi Admin. Akun berikutnya default-nya Editor.

## Menjalankan di komputer

Butuh **Node.js 22** (`nvm use` akan membaca `.nvmrc`).

```sh
cp .env.example .env   # lalu isi DATABASE_URL dan PAYLOAD_SECRET
npm install
npm run seed           # isi database kosong dengan konten awal (aman dijalankan ulang)
npm run dev            # http://localhost:3000, dashboard di http://localhost:3000/admin
```

### Database development & production

Ada dua database di cluster Atlas yang sama. Yang membedakan hanya nama database di akhir URL:

| Database | Dipakai oleh | Diatur di |
|---|---|---|
| `ponpes-dev` | `npm run dev`, `npm run seed` | `.env` |
| `ponpes` | website online, `npm run build` / `npm run start` di laptop, `npm run seed:prod` | Vercel › Environment Variables (Production) dan `.env.production.local` |

`.env.production.local` cukup berisi `DATABASE_URL` dan `S3_PREFIX` production. Variabel lain diambil dari `.env`. Kedua file tidak ikut ke git.

Foto juga dipisah per database lewat `S3_PREFIX`: development di folder `media-dev/`, production di `media/` (bucket yang sama). Tanpa pemisahan ini, file dengan nama yang sama bisa saling menimpa atau ikut terhapus.

Hati-hati: `npm run build`, `npm run start`, dan `npm run seed:prod` di laptop **memakai database production**.

Saat development, `S3_BUCKET` boleh dikosongkan. Foto akan disimpan di folder lokal `media/`.

Setelah mengubah struktur data di `src/collections` atau `src/globals`, jalankan `npm run generate:types`.

## Struktur kode

| Lokasi | Isi |
|---|---|
| `src/payload.config.ts` | Konfigurasi Payload: database, S3, bahasa, plugin ekspor |
| `src/collections/` | Berita, Galeri, Media, Pendaftar PSB, Akun Admin |
| `src/globals/` | Isi halaman: Beranda, Profil, Program, Info Pondok, Info PSB |
| `src/access.ts` | Aturan hak akses per peran |
| `src/app/(frontend)/` | Halaman website |
| `src/app/(frontend)/psb/` | Halaman PSB dan formulir pendaftaran (validasi di `actions.ts`) |
| `src/app/(payload)/` | Dashboard admin dan API (dibuat otomatis oleh Payload, jangan diedit) |
| `src/seed/index.ts` | Konten awal untuk database baru |

Setiap konten diubah di dashboard, website otomatis diperbarui. Halaman tetap cepat karena di-cache, dan cache-nya dibuang setiap ada perubahan.

## Setup layanan

### 1. MongoDB Atlas (gratis)
1. Daftar di mongodb.com/atlas, lalu buat cluster **M0 (Free)**. Pilih region Singapore supaya dekat.
2. Di **Database Access**, buat user database dan password.
3. Di **Network Access**, tambahkan `0.0.0.0/0`. Vercel tidak punya IP tetap, jadi akses harus dibuka untuk semua IP. Keamanan tetap dijaga oleh username dan password.
4. Di **Connect › Drivers**, salin connection string, lalu tambahkan nama database di akhir, contoh: `.../ponpes?retryWrites=true&w=majority`

### 2. S3 IDCloudHost
1. Buat bucket di Object Storage IDCloudHost, lalu catat **endpoint**, **access key**, dan **secret key**.
2. Atur **CORS** bucket supaya dashboard bisa upload langsung dari browser. Ini perlu agar foto besar tidak terkena batas upload 4.5MB di Vercel:
   ```json
   [
     {
       "AllowedOrigins": ["https://DOMAIN-WEBSITE", "http://localhost:3000"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```
3. Pasang **bucket policy** supaya foto di folder `media/` (production) dan `media-dev/` (development) bisa dibuka publik. Folder lain dan daftar isi bucket tetap privat:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Sid": "PublicReadWebsiteMedia",
       "Effect": "Allow",
       "Principal": "*",
       "Action": ["s3:GetObject"],
       "Resource": ["arn:aws:s3:::NAMA-BUCKET/media/*", "arn:aws:s3:::NAMA-BUCKET/media-dev/*"]
     }]
   }
   ```
   Ini wajib. Upload dari dashboard dilakukan langsung dari browser lewat URL bertanda tangan, dan storage IDCloudHost tidak menerapkan ACL `public-read` pada cara upload ini. Tanpa policy, file asli foto akan tampil 403. Bucket `hurriyyatunnas` sudah dipasang policy ini.

### 3. Vercel
1. Import repo GitHub di vercel.com. Framework akan terdeteksi otomatis sebagai Next.js.
2. Isi **Environment Variables** sesuai `.env.example`: `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
   - **Production**: `DATABASE_URL` ke database `ponpes`, `S3_PREFIX` dikosongkan (default `media`).
   - **Preview** (opsional): `DATABASE_URL` ke `ponpes-dev`, `S3_PREFIX=media-dev`.
   - Tambahkan domain Vercel ke CORS bucket S3, supaya upload dari dashboard production tidak ditolak.
3. Klik Deploy. Database harus sudah bisa diakses saat build, karena halaman dibuat dari data MongoDB.
4. Isi database production pertama kali dari laptop: `npm run seed:prod` (memakai `DATABASE_URL` dari `.env.production.local`). Untuk Preview deployment di Vercel, isi `DATABASE_URL` dengan database `ponpes-dev`.
5. Buka `/admin` dan buat akun admin pertama.

**Jangan pernah commit file `.env`.** File itu berisi password database dan kunci S3. File `.env` sudah masuk `.gitignore`.

## Checklist sebelum online
- [ ] Isi Info Pondok & Kontak: alamat, telepon, WhatsApp, email, sosmed, logo
- [ ] Isi Beranda (foto banner, sambutan, foto pimpinan), Profil, dan Program
- [ ] Isi Info PSB: jenjang, jadwal, biaya. Matikan "Pendaftaran dibuka" kalau belum waktunya
- [ ] Hapus 2 contoh berita, lalu tambahkan berita asli
- [ ] Buat akun untuk editor dan panitia PSB dengan peran yang sesuai
- [ ] Di Vercel Production, isi `ALLOW_INDEXING=true` lalu redeploy, supaya website bisa diindeks Google. Selama belum diisi, `robots.txt` dan meta `noindex` memblokir Google
- [ ] Daftarkan website di Google Search Console, lalu kirim `https://DOMAIN/sitemap.xml`
