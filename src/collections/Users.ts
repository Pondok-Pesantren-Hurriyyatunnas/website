import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminField, isAdminOrSelf } from '../access'

// Akun pertama (layar "buat pengguna pertama") otomatis menjadi admin
const makeFirstUserAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  // Pakai `find`, bukan `count`: count tanpa filter tidak didukung di dalam transaction MongoDB (Atlas)
  const { docs } = await req.payload.find({ collection: 'users', limit: 1, depth: 0, pagination: false, req })
  if (docs.length === 0) data.role = 'admin'
  return data
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin', plural: 'Akun Admin' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Pengaturan',
    hidden: ({ user }) => !hasRole({ user } as never, 'admin'),
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: { beforeChange: [makeFirstUserAdmin] },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    {
      name: 'role',
      label: 'Peran',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { create: isAdminField, update: isAdminField },
      options: [
        { label: 'Admin (akses penuh)', value: 'admin' },
        { label: 'Editor (kelola konten website)', value: 'editor' },
        { label: 'Panitia PSB (kelola pendaftar)', value: 'admissions' },
      ],
    },
  ],
}
