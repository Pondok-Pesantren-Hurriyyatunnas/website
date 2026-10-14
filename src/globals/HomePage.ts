import type { GlobalConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Beranda',
  admin: { group: 'Halaman Website' },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Banner Utama',
          fields: [
            {
              name: 'heroSubtitle',
              label: 'Teks di bawah judul',
              type: 'textarea',
              admin: { description: 'Kosongkan untuk memakai tagline pondok.' },
            },
            { name: 'heroImage', label: 'Foto Banner', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Angka Statistik',
          fields: [
            {
              name: 'stats',
              label: 'Angka Statistik',
              type: 'array',
              maxRows: 4,
              labels: { singular: 'Angka', plural: 'Angka' },
              admin: {
                description:
                  'Tampil di bawah banner, mis. "250+" Santri aktif. Kosongkan untuk memakai data otomatis (tahun berdiri, jumlah jenjang, ekstrakurikuler).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      label: 'Angka',
                      type: 'text',
                      required: true,
                      admin: { width: '35%' },
                    },
                    { name: 'label', label: 'Keterangan', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Keunggulan',
          fields: [
            {
              name: 'featuresHeading',
              label: 'Judul Bagian',
              type: 'text',
              defaultValue: 'Pendidikan yang Menyeluruh',
            },
            {
              name: 'features',
              label: 'Daftar Keunggulan',
              type: 'array',
              maxRows: 8,
              labels: { singular: 'Keunggulan', plural: 'Keunggulan' },
              fields: [
                { name: 'title', label: 'Judul', type: 'text', required: true },
                { name: 'description', label: 'Deskripsi', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Sambutan Pimpinan',
          fields: [
            {
              name: 'welcomeHeading',
              label: 'Judul',
              type: 'text',
              defaultValue: 'Assalamu’alaikum warahmatullahi wabarakatuh',
            },
            { name: 'welcomeBody', label: 'Isi Sambutan', type: 'textarea' },
            { name: 'leaderName', label: 'Nama Pimpinan', type: 'text' },
            { name: 'leaderPhoto', label: 'Foto Pimpinan', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
