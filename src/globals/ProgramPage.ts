import type { GlobalConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const ProgramPage: GlobalConfig = {
  slug: 'program-page',
  label: 'Program Pendidikan',
  admin: {
    group: 'Halaman Website',
    description:
      'Isi halaman Program: jenjang pendidikan, kegiatan harian ("Sehari di Pondok", juga tampil di Beranda), dan ekstrakurikuler. Klik ikon mata di sebelah tombol Simpan untuk melihat hasilnya langsung di samping form.',
  },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: 'levels',
      label: 'Jenjang & Program',
      type: 'array',
      labels: { singular: 'Jenjang', plural: 'Jenjang' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Nama', type: 'text', required: true },
            {
              name: 'label',
              label: 'Keterangan singkat',
              type: 'text',
              admin: { description: 'Mis. "Setara SMP, 3 tahun"' },
            },
          ],
        },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
        {
          name: 'photo',
          label: 'Foto',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Tampil di Beranda & halaman Program (bingkai tegak). Kosongkan untuk memakai foto Galeri yang belum dipakai jenjang lain. Atur titik fokus foto di menu Media supaya potongannya pas.',
          },
        },
      ],
    },
    {
      name: 'dailySchedule',
      label: 'Kegiatan Harian Santri',
      type: 'array',
      labels: { singular: 'Kegiatan', plural: 'Kegiatan' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'time', label: 'Jam', type: 'text', required: true, admin: { width: '25%' } },
            { name: 'activity', label: 'Kegiatan', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'extracurriculars',
      label: 'Ekstrakurikuler',
      type: 'array',
      labels: { singular: 'Ekstrakurikuler', plural: 'Ekstrakurikuler' },
      fields: [{ name: 'name', label: 'Nama', type: 'text', required: true }],
    },
  ],
}
