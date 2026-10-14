import type { CollectionConfig, FieldHook } from 'payload'

import { canEditContent, publishedOrEditor } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const fillSlugFromTitle: FieldHook = ({ value, data }) =>
  value ? slugify(value) : data?.title ? slugify(data.title) : value

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Berita', plural: 'Berita' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: 'Konten',
  },
  defaultSort: '-publishedAt',
  access: {
    read: publishedOrEditor,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug (alamat URL)',
      type: 'text',
      unique: true,
      index: true,
      hooks: { beforeValidate: [fillSlugFromTitle] },
      admin: { position: 'sidebar', description: 'Kosongkan untuk dibuat otomatis dari judul.' },
    },
    {
      name: 'publishedAt',
      label: 'Tanggal',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'select',
      required: true,
      defaultValue: 'activity',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Kegiatan', value: 'activity' },
        { label: 'Pengumuman', value: 'announcement' },
        { label: 'Prestasi', value: 'achievement' },
        { label: 'Kajian', value: 'study' },
        { label: 'Artikel', value: 'article' },
      ],
    },
    { name: 'thumbnail', label: 'Gambar Utama', type: 'upload', relationTo: 'media' },
    {
      name: 'excerpt',
      label: 'Ringkasan',
      type: 'textarea',
      admin: { description: 'Satu-dua kalimat yang tampil di daftar berita.' },
    },
    { name: 'content', label: 'Isi Berita', type: 'richText', required: true },
  ],
}
