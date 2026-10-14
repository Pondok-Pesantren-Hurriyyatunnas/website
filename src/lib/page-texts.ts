// Teks judul, pembuka, dan tombol di setiap halaman website.
// Satu sumber untuk: isian dashboard (global "Teks Halaman") dan nilai bawaan saat isian kosong.
// Placeholder yang bisa dipakai: {nama} = nama pondok, {tahun} = tahun ajaran PSB.

type TextSpec = { label: string; default: string; multiline?: boolean }

const intro = (eyebrow: string, title: string, subtitle: string) => ({
  introEyebrow: { label: 'Pembuka: label kecil', default: eyebrow },
  introTitle: { label: 'Pembuka: judul halaman', default: title },
  introSubtitle: { label: 'Pembuka: keterangan', default: subtitle, multiline: true },
})

export const PAGE_TEXTS = {
  home: {
    label: 'Beranda',
    fields: {
      heroEyebrow: { label: 'Banner: label kecil di atas nama', default: 'Pondok Pesantren' },
      heroTitle: { label: 'Banner: nama (baris 1)', default: 'Hurriyyatunnas' },
      heroTitleAccent: { label: 'Banner: nama (baris 2, miring hijau)', default: 'Bakti Awo' },
      heroButton: { label: 'Banner: tombol utama', default: 'Daftarkan Calon Santri' },
      heroLink: { label: 'Banner: tautan kedua', default: 'Kenali pondok kami' },
      quickRegister: { label: 'Akses cepat 1 (daftar)', default: 'Daftar Online' },
      quickFees: { label: 'Akses cepat 2 (biaya)', default: 'Rincian Biaya' },
      quickSchedule: { label: 'Akses cepat 3 (jadwal)', default: 'Jadwal PSB' },
      quickLocation: { label: 'Akses cepat 4 (lokasi)', default: 'Lokasi & Kontak' },
      featuresEyebrow: { label: 'Keunggulan: label kecil', default: 'Ciri khas pesantren' },
      levelsEyebrow: { label: 'Jenjang: label kecil', default: 'Program pendidikan' },
      levelsTitle: { label: 'Jenjang: judul', default: 'Jenjang yang tersedia' },
      welcomeEyebrow: { label: 'Sambutan: label kecil', default: 'Sambutan pimpinan' },
      leaderRole: { label: 'Sambutan: jabatan di bawah nama', default: 'Pimpinan Pondok' },
      newsEyebrow: { label: 'Berita: label kecil', default: 'Kabar pondok' },
      newsTitle: { label: 'Berita: judul', default: 'Berita terbaru' },
      ctaEyebrow: { label: 'Ajakan PSB: label kecil', default: 'Penerimaan santri baru' },
      ctaTitle: { label: 'Ajakan PSB: judul', default: 'Tahun Ajaran {tahun}' },
      ctaOpenText: {
        label: 'Ajakan PSB: teks saat pendaftaran dibuka',
        default: 'Pendaftaran dibuka dan dapat dilakukan sepenuhnya secara online.',
        multiline: true,
      },
      ctaClosedText: {
        label: 'Ajakan PSB: teks saat pendaftaran ditutup',
        default: 'Pendaftaran belum dibuka. Pantau terus informasinya.',
        multiline: true,
      },
    },
  },
  profil: {
    label: 'Profil',
    fields: {
      ...intro(
        'Tentang kami',
        'Profil Pondok',
        'Mengenal lebih dekat {nama}: perjalanan, cita-cita, dan orang-orang di baliknya.',
      ),
      historyEyebrow: { label: 'Sejarah: label kecil', default: 'Sejarah singkat' },
      historyTitle: { label: 'Sejarah: judul', default: 'Perjalanan pondok' },
      visionEyebrow: { label: 'Visi: label kecil', default: 'Visi' },
      missionEyebrow: { label: 'Misi: label kecil', default: 'Misi' },
      missionTitle: { label: 'Misi: judul', default: 'Langkah kami' },
      staffEyebrow: { label: 'Pengurus: label kecil', default: 'Pengurus' },
      staffTitle: { label: 'Pengurus: judul', default: 'Struktur pengurus' },
    },
  },
  program: {
    label: 'Program',
    fields: {
      ...intro(
        'Pendidikan',
        'Program Pendidikan',
        'Jenjang pendidikan formal dan kepesantrenan, kegiatan harian santri, serta ekstrakurikuler.',
      ),
      levelsEyebrow: { label: 'Jenjang: label kecil', default: 'Jenjang & program' },
      levelsTitle: { label: 'Jenjang: judul', default: 'Pilihan pendidikan' },
      dailyEyebrow: {
        label: 'Sehari di Pondok: label kecil (juga di Beranda)',
        default: 'Kehidupan santri',
      },
      dailyTitle: {
        label: 'Sehari di Pondok: judul (juga di Beranda)',
        default: 'Sehari di Pondok',
      },
      dailyText: {
        label: 'Sehari di Pondok: keterangan (juga di Beranda)',
        default:
          'Dari tahajud dan subuh berjamaah hingga belajar malam di asrama, setiap waktu santri terisi dengan ibadah, mengaji, belajar, dan pembinaan akhlak.',
        multiline: true,
      },
      extraEyebrow: { label: 'Ekstrakurikuler: label kecil', default: 'Pengembangan diri' },
      extraTitle: { label: 'Ekstrakurikuler: judul', default: 'Ekstrakurikuler' },
    },
  },
  psb: {
    label: 'PSB',
    fields: {
      ...intro(
        'PSB online',
        'Penerimaan Santri Baru {tahun}',
        'Syarat, jadwal, biaya, dan formulir pendaftaran calon santri.',
      ),
      stepsEyebrow: { label: 'Alur: label kecil', default: 'Langkah demi langkah' },
      stepsTitle: { label: 'Alur: judul', default: 'Alur pendaftaran' },
      formEyebrow: { label: 'Formulir: label kecil', default: 'Daftar online' },
      formTitle: { label: 'Formulir: judul', default: 'Formulir pendaftaran' },
      formText: {
        label: 'Formulir: keterangan',
        default:
          'Isi data calon santri dengan benar. Kolom bertanda * wajib diisi. Setelah terkirim, Anda akan mendapat nomor pendaftaran dan panitia akan menghubungi lewat WhatsApp.',
        multiline: true,
      },
    },
  },
  berita: {
    label: 'Berita',
    fields: intro(
      'Kabar pondok',
      'Berita & Kegiatan',
      'Kabar terbaru dari kehidupan santri, kegiatan, dan pengumuman pondok.',
    ),
  },
  galeri: {
    label: 'Galeri',
    fields: intro(
      'Dokumentasi',
      'Galeri',
      'Potret kegiatan santri dan suasana pondok. Klik foto untuk melihat lebih besar.',
    ),
  },
  kontak: {
    label: 'Kontak',
    fields: intro(
      'Kontak',
      'Hubungi Kami',
      'Silakan berkunjung ke pondok atau hubungi kami untuk informasi pendaftaran dan kegiatan santri.',
    ),
  },
} satisfies Record<string, { label: string; fields: Record<string, TextSpec> }>

export type PageKey = keyof typeof PAGE_TEXTS
export type PageTexts<P extends PageKey> = Record<keyof (typeof PAGE_TEXTS)[P]['fields'], string>

/** Gabungkan isian dashboard dengan nilai bawaan, lalu isi placeholder {nama} / {tahun}. */
export function resolvePageTexts<P extends PageKey>(
  page: P,
  stored: Record<string, unknown> | null | undefined,
  vars: { nama?: string; tahun?: string } = {},
): PageTexts<P> {
  const fields = PAGE_TEXTS[page].fields as Record<string, TextSpec>
  const result: Record<string, string> = {}
  for (const [key, spec] of Object.entries(fields)) {
    const value = stored?.[key]
    const text = typeof value === 'string' && value.trim() ? value : spec.default
    result[key] = text.replace(/\{nama\}/g, vars.nama ?? '').replace(/\{tahun\}/g, vars.tahun ?? '')
  }
  return result as PageTexts<P>
}
