import type { GlobalConfig } from 'payload'

import { anyone, hasRole } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const Admissions: GlobalConfig = {
  slug: 'admissions',
  label: 'Info PSB',
  admin: {
    group: 'PSB',
    description:
      'Info penerimaan santri baru: status buka/tutup, tanggal penutupan (hitung mundur), jenjang di formulir, alur, syarat, jadwal, dan biaya. Klik ikon mata di sebelah tombol Simpan untuk melihat hasilnya langsung di samping form.',
  },
  access: {
    read: anyone,
    update: ({ req }) => hasRole(req, 'admin', 'editor', 'admissions'),
  },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'academicYear',
          label: 'Tahun Ajaran',
          type: 'text',
          required: true,
          defaultValue: '2027/2028',
        },
        {
          name: 'isOpen',
          label: 'Pendaftaran dibuka',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Jika dimatikan, formulir pendaftaran di website disembunyikan.' },
        },
      ],
    },
    {
      name: 'closesAt',
      label: 'Tanggal penutupan pendaftaran',
      type: 'date',
      admin: {
        description:
          'Dipakai untuk hitung mundur di dashboard. Formulir tidak otomatis tertutup; matikan "Pendaftaran dibuka" secara manual.',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'd MMMM yyyy, HH:mm' },
      },
    },
    {
      name: 'levels',
      label: 'Pilihan Jenjang di Formulir',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Jenjang', plural: 'Jenjang' },
      fields: [{ name: 'name', label: 'Nama Jenjang', type: 'text', required: true }],
    },
    {
      name: 'steps',
      label: 'Alur Pendaftaran',
      type: 'array',
      labels: { singular: 'Langkah', plural: 'Langkah' },
      fields: [{ name: 'text', label: 'Langkah', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      label: 'Persyaratan',
      type: 'array',
      labels: { singular: 'Syarat', plural: 'Syarat' },
      fields: [{ name: 'text', label: 'Syarat', type: 'text', required: true }],
    },
    {
      name: 'schedule',
      label: 'Jadwal',
      type: 'array',
      labels: { singular: 'Jadwal', plural: 'Jadwal' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'activity', label: 'Kegiatan', type: 'text', required: true },
            { name: 'time', label: 'Waktu', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'fees',
      label: 'Rincian Biaya',
      type: 'array',
      labels: { singular: 'Biaya', plural: 'Biaya' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'item', label: 'Item', type: 'text', required: true },
            { name: 'amount', label: 'Nominal', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}
