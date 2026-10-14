import type { Field, GlobalConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'
import { PAGE_TEXTS } from '../lib/page-texts'

// Isian dibangkitkan dari PAGE_TEXTS supaya daftar teks & nilai bawaan hanya ditulis sekali
const tabs = Object.entries(PAGE_TEXTS).map(([name, page]) => ({
  name,
  label: page.label,
  fields: Object.entries(page.fields).map(([fieldName, spec]): Field =>
    'multiline' in spec && spec.multiline
      ? {
          name: fieldName,
          label: spec.label,
          type: 'textarea',
          admin: { placeholder: spec.default },
        }
      : { name: fieldName, label: spec.label, type: 'text', admin: { placeholder: spec.default } },
  ),
}))

export const PageTexts: GlobalConfig = {
  slug: 'page-texts',
  label: 'Teks Halaman',
  admin: {
    group: 'Halaman Website',
    description:
      'Judul, keterangan, dan teks tombol di setiap halaman. Kosongkan isian untuk memakai teks bawaan (terlihat samar di dalam kotak). Bisa memakai {nama} untuk nama pondok dan {tahun} untuk tahun ajaran PSB. Klik ikon mata di sebelah tombol Simpan untuk melihat hasilnya langsung di samping form.',
  },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [{ type: 'tabs', tabs }],
}
