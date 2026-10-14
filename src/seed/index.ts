// Mengisi database kosong dengan konten awal. Jalankan: npm run seed
// Aman dijalankan berulang: data yang sudah diisi tidak ditimpa.
import { getPayload } from 'payload'

import config from '../payload.config'

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  children: [{ type: 'text', version: 1, text, detail: 0, format: 0, mode: 'normal', style: '' }],
})

const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: paragraphs.map(paragraph),
  },
})

const payload = await getPayload({ config })

const site = await payload.findGlobal({ slug: 'site-settings' })
if (!site.name) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: 'Pondok Pesantren Hurriyyatunnas Bakti Awo',
      shortName: 'PP Hurriyyatunnas',
      tagline: 'Membentuk generasi berilmu, berakhlak mulia, dan bermanfaat bagi umat',
      description:
        'Pondok Pesantren Hurriyyatunnas Bakti Awo adalah lembaga pendidikan Islam yang memadukan ilmu agama dan ilmu umum dalam lingkungan asrama yang islami.',
      foundedYear: '[isi tahun]',
      address: '[Isi alamat lengkap pondok]',
      phone: '[isi nomor telepon]',
      whatsapp: '6281234567890',
      email: 'info@contoh.com',
      mapsQuery: 'Pondok Pesantren Hurriyyatunnas Bakti Awo',
    },
  })
  payload.logger.info('✓ Info Pondok & Kontak')
}

const home = await payload.findGlobal({ slug: 'home-page' })
if (!home.features?.length) {
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      featuresHeading: 'Pendidikan yang Menyeluruh',
      features: [
        { title: 'Tahfidz Al-Qur’an', description: 'Program hafalan Al-Qur’an terbimbing dengan target bertahap dan setoran harian.' },
        { title: 'Kajian Kitab Kuning', description: 'Pembelajaran kitab-kitab klasik sebagai fondasi ilmu agama yang kokoh.' },
        { title: 'Pendidikan Formal', description: 'Kurikulum nasional berjalan seiring kurikulum kepesantrenan.' },
        { title: 'Pembinaan Akhlak', description: 'Kehidupan asrama 24 jam yang membentuk disiplin, kemandirian, dan adab.' },
      ],
      welcomeHeading: 'Assalamu’alaikum warahmatullahi wabarakatuh',
      welcomeBody:
        'Kami berkomitmen mendidik santri agar menjadi pribadi yang beriman, berilmu, dan berakhlakul karimah. [Ganti dengan sambutan pimpinan pondok.]',
      leaderName: '[Nama pimpinan]',
    },
  })
  payload.logger.info('✓ Beranda')
}

const profile = await payload.findGlobal({ slug: 'profile-page' })
if (!profile.missions?.length) {
  await payload.updateGlobal({
    slug: 'profile-page',
    data: {
      history: richText(
        '[Tuliskan kisah berdirinya pondok: siapa pendirinya, latar belakang pendirian, dan perkembangan pondok hingga saat ini.]',
        '[Paragraf lanjutan sejarah pondok.]',
      ),
      vision: 'Terwujudnya generasi muslim yang beriman, berilmu, berakhlak mulia, dan bermanfaat bagi umat.',
      missions: [
        { text: 'Menyelenggarakan pendidikan Islam yang memadukan ilmu agama dan ilmu umum.' },
        { text: 'Membina santri agar istiqamah beribadah dan berakhlakul karimah.' },
        { text: 'Menumbuhkan kemandirian, kedisiplinan, dan jiwa kepemimpinan.' },
        { text: 'Menyiapkan generasi yang bermanfaat bagi masyarakat, bangsa, dan agama.' },
      ],
      staff: [
        { name: '[Nama pimpinan]', role: 'Pimpinan Pondok' },
        { name: '[Nama]', role: 'Kepala Madrasah' },
        { name: '[Nama]', role: 'Bagian Kepesantrenan' },
        { name: '[Nama]', role: 'Bagian Tata Usaha' },
      ],
    },
  })
  payload.logger.info('✓ Profil')
}

const program = await payload.findGlobal({ slug: 'program-page' })
if (!program.levels?.length) {
  await payload.updateGlobal({
    slug: 'program-page',
    data: {
      levels: [
        { name: 'Madrasah Tsanawiyah (MTs)', label: 'Setara SMP, 3 tahun', description: 'Kurikulum Kemenag dipadukan dengan pelajaran kepesantrenan.' },
        { name: 'Madrasah Aliyah (MA)', label: 'Setara SMA, 3 tahun', description: 'Persiapan melanjutkan ke perguruan tinggi dengan bekal ilmu agama yang kuat.' },
        { name: 'Program Tahfidz', label: 'Program unggulan', description: 'Bimbingan hafalan Al-Qur’an dengan metode talaqqi dan muraja’ah rutin.' },
      ],
      dailySchedule: [
        { time: '04.00', activity: 'Bangun, shalat tahajud & persiapan subuh' },
        { time: '04.30', activity: 'Shalat Subuh berjamaah & setoran hafalan' },
        { time: '07.00', activity: 'Kegiatan belajar mengajar (sekolah formal)' },
        { time: '12.00', activity: 'Shalat Dzuhur berjamaah & istirahat' },
        { time: '14.00', activity: 'Kajian kitab / madrasah diniyah' },
        { time: '15.30', activity: 'Shalat Ashar & ekstrakurikuler' },
        { time: '18.00', activity: 'Shalat Maghrib & tadarus Al-Qur’an' },
        { time: '19.30', activity: 'Shalat Isya & belajar malam' },
        { time: '22.00', activity: 'Istirahat' },
      ],
      extracurriculars: ['Muhadharah (pidato)', 'Hadrah / Rebana', 'Pramuka', 'Kaligrafi', 'Bahasa Arab & Inggris', 'Olahraga'].map(
        (name) => ({ name }),
      ),
    },
  })
  payload.logger.info('✓ Program Pendidikan')
}

const admissions = await payload.findGlobal({ slug: 'admissions' })
if (!admissions.levels?.length) {
  await payload.updateGlobal({
    slug: 'admissions',
    data: {
      academicYear: '2027/2028',
      isOpen: true,
      levels: [{ name: 'MTs (Setara SMP)' }, { name: 'MA (Setara SMA)' }],
      steps: ['Isi formulir online', 'Lengkapi berkas persyaratan', 'Ikuti tes & wawancara', 'Pengumuman hasil', 'Daftar ulang'].map(
        (text) => ({ text }),
      ),
      requirements: [
        'Mengisi formulir pendaftaran',
        'Fotokopi akta kelahiran dan kartu keluarga',
        'Fotokopi ijazah / surat keterangan lulus',
        'Pas foto 3x4 (4 lembar)',
        'Surat keterangan sehat dari dokter',
      ].map((text) => ({ text })),
      schedule: [
        { activity: 'Pendaftaran Gelombang 1', time: '[isi tanggal]' },
        { activity: 'Tes Masuk & Wawancara', time: '[isi tanggal]' },
        { activity: 'Pengumuman Hasil', time: '[isi tanggal]' },
        { activity: 'Daftar Ulang', time: '[isi tanggal]' },
      ],
      fees: [
        { item: 'Uang pendaftaran', amount: 'Rp [isi]' },
        { item: 'Uang pangkal / pembangunan', amount: 'Rp [isi]' },
        { item: 'Seragam & perlengkapan', amount: 'Rp [isi]' },
        { item: 'SPP & makan per bulan', amount: 'Rp [isi]' },
      ],
    },
  })
  payload.logger.info('✓ Info PSB')
}

const { totalDocs: newsCount } = await payload.count({ collection: 'news' })
if (newsCount === 0) {
  await payload.create({
    collection: 'news',
    data: {
      title: 'Contoh Berita: Pendaftaran Santri Baru Resmi Dibuka',
      publishedAt: '2026-10-01T00:00:00.000Z',
      category: 'announcement',
      excerpt: 'Ini adalah contoh berita. Hapus atau edit lewat dashboard admin, lalu ganti dengan berita asli pondok.',
      content: richText(
        'Ini adalah contoh berita untuk menunjukkan tampilan halaman artikel. Silakan hapus atau ubah lewat dashboard admin.',
        'Pendaftaran santri baru kini dapat dilakukan langsung secara online melalui halaman PSB.',
      ),
      _status: 'published',
    },
  })
  await payload.create({
    collection: 'news',
    data: {
      title: 'Contoh Berita: Kegiatan Muhadharah Santri',
      publishedAt: '2026-09-20T00:00:00.000Z',
      category: 'activity',
      excerpt: 'Contoh berita kegiatan santri. Ganti dengan dokumentasi kegiatan asli pondok.',
      content: richText('Ini adalah contoh berita kegiatan. Tambahkan Gambar Utama di dashboard agar tampilan berita lebih menarik.'),
      _status: 'published',
    },
  })
  payload.logger.info('✓ 2 contoh berita')
}

payload.logger.info('Seed selesai.')
process.exit(0)
