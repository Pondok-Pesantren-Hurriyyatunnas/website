import type { GlobalConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Info Pondok & Kontak',
  admin: {
    group: 'Halaman Website',
    description:
      'Identitas, kontak, dan media sosial pondok. Tampil di header, footer, halaman Kontak, dan tombol WhatsApp. Klik ikon mata di sebelah tombol Simpan untuk melihat hasilnya langsung di samping form.',
  },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identitas',
          fields: [
            { name: 'name', label: 'Nama Pondok', type: 'text', required: true },
            { name: 'shortName', label: 'Nama Singkat', type: 'text' },
            { name: 'tagline', label: 'Tagline', type: 'text' },
            {
              name: 'description',
              label: 'Deskripsi Singkat',
              type: 'textarea',
              admin: { description: 'Dipakai untuk SEO dan footer.' },
            },
            { name: 'foundedYear', label: 'Tahun Berdiri', type: 'text' },
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Kosongkan untuk memakai logo bawaan.' },
            },
          ],
        },
        {
          label: 'Kontak',
          fields: [
            { name: 'address', label: 'Alamat', type: 'textarea' },
            { name: 'phone', label: 'Telepon', type: 'text' },
            {
              name: 'whatsapp',
              label: 'Nomor WhatsApp',
              type: 'text',
              admin: {
                description: 'Format internasional tanpa + dan spasi, contoh 6281234567890',
              },
              validate: (value: string | null | undefined) =>
                !value ||
                /^62\d{8,13}$/.test(value) ||
                'Gunakan format 62xxxxxxxxxx tanpa + atau spasi',
            },
            { name: 'email', label: 'Email', type: 'email' },
            {
              name: 'mapsQuery',
              label: 'Kata kunci Google Maps',
              type: 'text',
              admin: { description: 'Nama tempat seperti yang muncul di Google Maps.' },
            },
          ],
        },
        {
          label: 'Media Sosial',
          fields: [
            { name: 'instagram', label: 'Link Instagram', type: 'text' },
            { name: 'facebook', label: 'Link Facebook', type: 'text' },
            { name: 'youtube', label: 'Link YouTube', type: 'text' },
          ],
        },
      ],
    },
  ],
}
