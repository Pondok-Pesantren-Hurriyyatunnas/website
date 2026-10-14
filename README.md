# Website Pondok Pesantren Hurriyyatunnas Bakti Awo

Website statis berbasis **Astro + Tailwind CSS**, dengan dashboard admin **Sveltia CMS** di `/admin`.
Semua layanan yang dipakai gratis: GitHub (penyimpanan konten) dan Cloudflare Workers (hosting).

## Menjalankan di komputer

Butuh **Node.js 22** atau lebih baru (`nvm use` akan membaca `.nvmrc`).

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # hasil build ada di folder dist/
```

## Struktur penting

| Lokasi | Isi |
|---|---|
| `src/pages/` | Halaman: beranda, profil, program, psb, berita, galeri, kontak |
| `src/content/news/` | Berita (file Markdown), diisi lewat dashboard |
| `src/content/gallery/` | Foto galeri (file JSON), diisi lewat dashboard |
| `src/data/site.json` | Nama, alamat, kontak, dan WhatsApp pondok (bisa diedit di dashboard) |
| `src/data/admissions.json` | Info PSB: tahun ajaran, jadwal, syarat, biaya, link Google Form (bisa diedit di dashboard) |
| `public/uploads/` | Gambar yang diupload dari dashboard |
| `public/admin/config.yml` | Konfigurasi dashboard admin |
| `src/components/Logo.astro` | Logo sementara. Ganti dengan logo resmi pondok |

Teks di halaman **Profil** dan **Program** masih contoh, ditandai `[...]`. Edit langsung di `src/pages/profil.astro` dan `src/pages/program.astro`.

## Deploy gratis

Website sudah online (mode preview) di https://ponpes-hurriyyatunnas.arul-21.workers.dev

### 1. Repo GitHub
Kode ada di `Pondok-Pesantren-Hurriyyatunnas/webiste`.

### 2. Hosting di Cloudflare Workers
Pengaturan deploy ada di `wrangler.jsonc`. Website disajikan sebagai file statis dari folder `dist`.

1. Masuk ke dash.cloudflare.com, buka **Workers & Pages**, pilih **Create**, lalu **Import a repository**, dan pilih repo tadi.
2. Isi pengaturan:
   - Project name: `ponpes-hurriyyatunnas` (harus sama dengan `name` di `wrangler.jsonc`)
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Di **Advanced settings**, tambahkan Build variable `NODE_VERSION` = `22`
3. Klik Deploy.

Setiap kali ada perubahan di GitHub, termasuk dari dashboard admin, website otomatis ter-update dalam 1–2 menit.

### 3. Mengaktifkan login dashboard (`/admin`)
Dashboard login memakai akun GitHub. Supaya tombol login berfungsi, pasang authenticator gratis di Cloudflare Workers:

1. Ikuti petunjuk di https://github.com/sveltia/sveltia-cms-auth (ada tombol *Deploy to Cloudflare Workers*).
2. Di GitHub, buka **Settings**, lalu **Developer settings**, lalu **OAuth Apps**, dan buat OAuth App baru dengan isian:
   - Homepage URL: alamat website
   - Authorization callback URL: `https://sveltia-cms-auth.NAMA-AKUN.workers.dev/callback`
3. Masukkan Client ID dan Client Secret ke pengaturan Worker sebagai `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET`. Isi juga `ALLOWED_DOMAINS` dengan domain website.
4. Edit `public/admin/config.yml`: isi `repo` dengan `username/nama-repo` dan isi `base_url` dengan URL Worker.

Admin pondok cukup punya akun GitHub (gratis) yang diundang sebagai **collaborator** di repo.

> Mau coba dashboard tanpa setup login? Jalankan `npm run dev`, buka `http://localhost:4321/admin` di Chrome atau Edge, lalu pilih **Work with Local Repository** dan arahkan ke folder project ini. Perubahan langsung tersimpan ke file lokal.

## Checklist sebelum online
- [ ] Ganti data di `src/data/site.json` (alamat, telepon, WhatsApp, email, sosmed)
- [ ] Ganti data PSB dan link Google Form di `src/data/admissions.json`
- [ ] Isi sejarah, visi misi, dan pengurus di halaman Profil
- [ ] Sesuaikan jenjang dan kegiatan di halaman Program
- [ ] Ganti logo sementara dengan logo resmi
- [ ] Ganti kotak placeholder foto di Beranda dengan foto asli pondok
- [ ] Hapus 2 contoh berita, lalu tambahkan berita asli
- [ ] Ganti `site_url` di `public/admin/config.yml` dengan alamat website
- [ ] Buka `public/robots.txt` supaya website bisa diindeks Google (sekarang masih mode preview)
