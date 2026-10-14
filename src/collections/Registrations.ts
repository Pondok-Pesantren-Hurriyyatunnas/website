import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { canManageAdmissions, hasRole } from '../access'

// Nomor pendaftaran unik, mis. PSB-20261014-4F7K
const generateRegistrationNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PSB-${date}-${random}`
}

const assignRegistrationNumber: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' && !data.registrationNumber) {
    data.registrationNumber = generateRegistrationNumber()
  }
  return data
}

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  labels: { singular: 'Pendaftar', plural: 'Pendaftar PSB' },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['registrationNumber', 'fullName', 'level', 'parentPhone', 'status', 'createdAt'],
    listSearchableFields: ['fullName', 'registrationNumber', 'parentName', 'parentPhone'],
    group: 'PSB',
    hidden: ({ user }) => !hasRole({ user } as never, 'admin', 'admissions'),
  },
  defaultSort: '-createdAt',
  // Formulir publik menyimpan data lewat server action (overrideAccess), bukan lewat API ini
  access: {
    create: canManageAdmissions,
    read: canManageAdmissions,
    update: canManageAdmissions,
    delete: canManageAdmissions,
  },
  hooks: { beforeChange: [assignRegistrationNumber] },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'registrationNumber',
          label: 'No. Pendaftaran',
          type: 'text',
          unique: true,
          index: true,
          admin: { readOnly: true },
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { label: 'Baru', value: 'new' },
            { label: 'Berkas diverifikasi', value: 'verified' },
            { label: 'Diterima', value: 'accepted' },
            { label: 'Tidak diterima', value: 'rejected' },
          ],
        },
        { name: 'academicYear', label: 'Tahun Ajaran', type: 'text', admin: { readOnly: true } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Data Calon Santri',
      fields: [
        { name: 'fullName', label: 'Nama Lengkap', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'gender',
              label: 'Jenis Kelamin',
              type: 'select',
              required: true,
              options: [
                { label: 'Laki-laki', value: 'male' },
                { label: 'Perempuan', value: 'female' },
              ],
            },
            { name: 'level', label: 'Jenjang Tujuan', type: 'text', required: true },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'birthPlace', label: 'Tempat Lahir', type: 'text', required: true },
            {
              name: 'birthDate',
              label: 'Tanggal Lahir',
              type: 'date',
              required: true,
              admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' } },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'nisn', label: 'NISN', type: 'text' },
            { name: 'previousSchool', label: 'Asal Sekolah', type: 'text', required: true },
          ],
        },
        { name: 'address', label: 'Alamat Lengkap', type: 'textarea', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Data Orang Tua / Wali',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'parentName', label: 'Nama Orang Tua / Wali', type: 'text', required: true },
            { name: 'parentOccupation', label: 'Pekerjaan', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'parentPhone', label: 'No. WhatsApp', type: 'text', required: true },
            { name: 'parentEmail', label: 'Email', type: 'email' },
          ],
        },
      ],
    },
    { name: 'notes', label: 'Catatan dari Pendaftar', type: 'textarea' },
    {
      name: 'adminNotes',
      label: 'Catatan Panitia (internal)',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
}
