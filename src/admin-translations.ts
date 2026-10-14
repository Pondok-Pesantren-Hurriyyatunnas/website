import { idTranslations as importExportId } from '@payloadcms/plugin-import-export/translations/languages/id'

// Payload belum menyediakan terjemahan Indonesia untuk editor teks (Lexical),
// dan plugin import-export lupa mendaftarkan terjemahan Indonesia-nya.
// Keduanya didaftarkan di sini lewat config.i18n.translations.
const lexicalId = {
  general: {
    placeholder: "Mulai menulis, atau ketik '/' untuk perintah...",
    slashMenuBasicGroupLabel: 'Dasar',
    slashMenuListGroupLabel: 'Daftar',
    toolbarItemsActive: '{{count}} aktif',
  },
  textState: { defaultStyle: 'Gaya bawaan' },
  upload: { label: 'Unggah gambar' },
  indent: { decreaseLabel: 'Kurangi indentasi', increaseLabel: 'Tambah indentasi' },
  blocks: {
    inlineBlocks: {
      create: 'Buat {{label}}',
      edit: 'Ubah {{label}}',
      label: 'Blok sebaris',
      remove: 'Hapus {{label}}',
    },
    label: 'Blok',
  },
  align: {
    alignCenterLabel: 'Rata tengah',
    alignJustifyLabel: 'Rata kanan-kiri',
    alignLeftLabel: 'Rata kiri',
    alignRightLabel: 'Rata kanan',
  },
  relationship: { label: 'Relasi' },
  link: { label: 'Tautan', loadingWithEllipsis: 'Memuat...' },
  blockquote: { label: 'Kutipan' },
  horizontalRule: { label: 'Garis pemisah' },
  paragraph: { label: 'Paragraf', label2: 'Teks biasa' },
  heading: { label: 'Judul {{headingLevel}}' },
  orderedList: { label: 'Daftar bernomor' },
  checklist: { label: 'Daftar centang' },
  unorderedList: { label: 'Daftar poin' },
}

export const adminTranslations = {
  id: { ...importExportId, lexical: lexicalId },
}
