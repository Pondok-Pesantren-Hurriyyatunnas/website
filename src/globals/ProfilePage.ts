import type { GlobalConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const ProfilePage: GlobalConfig = {
  slug: 'profile-page',
  label: 'Profil',
  admin: { group: 'Halaman Website' },
  access: { read: anyone, update: canEditContent },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'history', label: 'Sejarah Singkat', type: 'richText' },
    { name: 'vision', label: 'Visi', type: 'textarea' },
    {
      name: 'missions',
      label: 'Misi',
      type: 'array',
      labels: { singular: 'Misi', plural: 'Misi' },
      fields: [{ name: 'text', label: 'Misi', type: 'text', required: true }],
    },
    {
      name: 'staff',
      label: 'Struktur Pengurus',
      type: 'array',
      labels: { singular: 'Pengurus', plural: 'Pengurus' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', label: 'Nama', type: 'text', required: true },
            { name: 'role', label: 'Jabatan', type: 'text', required: true },
          ],
        },
        { name: 'photo', label: 'Foto', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
