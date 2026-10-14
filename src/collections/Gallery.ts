import type { CollectionConfig } from 'payload'

import { anyone, canEditContent } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Foto', plural: 'Galeri' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'image', 'date'],
    group: 'Konten',
  },
  defaultSort: '-date',
  access: {
    read: anyone,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Judul Foto', type: 'text', required: true },
    { name: 'image', label: 'Foto', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'date',
      label: 'Tanggal',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
    },
    { name: 'caption', label: 'Keterangan', type: 'text' },
  ],
}
