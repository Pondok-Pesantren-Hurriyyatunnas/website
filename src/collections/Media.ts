import type { CollectionConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'File', plural: 'Media' },
  admin: { group: 'Konten' },
  access: {
    read: anyone,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  // Foto dipakai langsung di banyak halaman; perubahan/hapus harus membuang cache halaman
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      label: 'Deskripsi gambar',
      type: 'text',
      required: true,
      admin: { description: 'Jelaskan isi gambar secara singkat (untuk aksesibilitas & SEO).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    // Ukuran-ukuran ini dibuat otomatis supaya halaman ringan dibuka di HP
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'large', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
}
