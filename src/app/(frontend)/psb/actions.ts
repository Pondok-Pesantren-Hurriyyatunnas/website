'use server'

import { getPayloadClient } from '@/lib/payload'

export type RegistrationState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  registrationNumber?: string
  fieldErrors?: Record<string, string>
  // Dikembalikan saat gagal, supaya isian form tidak hilang
  values?: Record<string, string>
}

const requiredFields: Record<string, string> = {
  fullName: 'Nama lengkap',
  gender: 'Jenis kelamin',
  level: 'Jenjang tujuan',
  birthPlace: 'Tempat lahir',
  birthDate: 'Tanggal lahir',
  previousSchool: 'Asal sekolah',
  address: 'Alamat',
  parentName: 'Nama orang tua / wali',
  parentPhone: 'No. WhatsApp',
}

// 0812-3456-7890 / +62 812... -> 6281234567890
const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

const getText = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim().slice(0, 1000)

export async function submitRegistration(_prev: RegistrationState, formData: FormData): Promise<RegistrationState> {
  // Jebakan bot: field ini disembunyikan dari manusia, jadi harus kosong
  if (getText(formData, 'website')) return { status: 'success', registrationNumber: '-' }

  const payload = await getPayloadClient()
  const admissions = await payload.findGlobal({ slug: 'admissions', depth: 0 })
  if (!admissions.isOpen) {
    return { status: 'error', message: 'Mohon maaf, pendaftaran sedang ditutup.' }
  }

  const values = Object.fromEntries(
    [...Object.keys(requiredFields), 'nisn', 'parentOccupation', 'parentEmail', 'notes'].map((key) => [key, getText(formData, key)]),
  )

  const fieldErrors: Record<string, string> = {}
  for (const [key, label] of Object.entries(requiredFields)) {
    if (!values[key]) fieldErrors[key] = `${label} wajib diisi`
  }

  const allowedLevels = (admissions.levels ?? []).map((level) => level.name)
  if (values.level && allowedLevels.length > 0 && !allowedLevels.includes(values.level)) {
    fieldErrors.level = 'Pilih jenjang dari daftar'
  }
  if (values.gender && !['male', 'female'].includes(values.gender)) {
    fieldErrors.gender = 'Pilih jenis kelamin'
  }
  const parentPhone = normalizePhone(values.parentPhone)
  if (values.parentPhone && !/^62\d{8,13}$/.test(parentPhone)) {
    fieldErrors.parentPhone = 'Nomor WhatsApp tidak valid'
  }
  if (values.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parentEmail)) {
    fieldErrors.parentEmail = 'Format email tidak valid'
  }
  const birthDate = new Date(values.birthDate)
  if (values.birthDate && (Number.isNaN(birthDate.getTime()) || birthDate > new Date())) {
    fieldErrors.birthDate = 'Tanggal lahir tidak valid'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Periksa kembali data yang belum lengkap.', fieldErrors, values }
  }

  try {
    const registration = await payload.create({
      collection: 'registrations',
      overrideAccess: true,
      data: {
        status: 'new',
        academicYear: admissions.academicYear,
        fullName: values.fullName,
        gender: values.gender as 'male' | 'female',
        level: values.level,
        birthPlace: values.birthPlace,
        birthDate: birthDate.toISOString(),
        nisn: values.nisn || undefined,
        previousSchool: values.previousSchool,
        address: values.address,
        parentName: values.parentName,
        parentOccupation: values.parentOccupation || undefined,
        parentPhone,
        parentEmail: values.parentEmail || undefined,
        notes: values.notes || undefined,
      },
    })
    return { status: 'success', registrationNumber: registration.registrationNumber ?? undefined }
  } catch (error) {
    payload.logger.error({ err: error }, 'Gagal menyimpan pendaftaran PSB')
    return { status: 'error', message: 'Terjadi kesalahan saat menyimpan. Silakan coba lagi atau hubungi panitia.', values }
  }
}
