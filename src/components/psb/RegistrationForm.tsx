'use client'

import { useActionState, type ReactNode } from 'react'

import { submitRegistration, type RegistrationState } from './actions'

type Props = {
  levels: string[]
  whatsapp?: string | null
}

const initialState: RegistrationState = { status: 'idle' }

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string
  name: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brand-900">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  )
}

export function RegistrationForm({ levels, whatsapp }: Props) {
  const [state, formAction, isPending] = useActionState(submitRegistration, initialState)
  const errors = state.fieldErrors ?? {}
  const values = state.values ?? {}

  if (state.status === 'success') {
    const confirmUrl = whatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Assalamu'alaikum, saya sudah mendaftar santri baru dengan nomor pendaftaran ${state.registrationNumber}.`)}`
      : undefined
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <div className="text-4xl">✅</div>
        <h3 className="mt-3 text-2xl font-extrabold text-brand-950">
          Pendaftaran berhasil dikirim
        </h3>
        <p className="mt-2 text-slate-600">Simpan nomor pendaftaran berikut:</p>
        <p className="mt-3 inline-block rounded-xl bg-white px-6 py-3 font-mono text-2xl font-bold tracking-wider text-brand-800">
          {state.registrationNumber}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
          Panitia akan menghubungi Anda melalui WhatsApp untuk tahap selanjutnya. Siapkan berkas
          persyaratan yang tercantum di halaman ini.
        </p>
        {confirmUrl && (
          <a
            href={confirmUrl}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-block rounded-full bg-[#25D366] px-6 py-3 font-bold text-white"
          >
            Konfirmasi via WhatsApp
          </a>
        )}
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {/* Jebakan bot: disembunyikan dari pengunjung */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {state.status === 'error' && state.message && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {state.message}
        </div>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-2 text-lg font-extrabold text-brand-950">Data Calon Santri</legend>
        <Field label="Nama Lengkap" name="fullName" error={errors.fullName} required>
          <input
            id="fullName"
            name="fullName"
            defaultValue={values.fullName}
            className="input"
            autoComplete="name"
            required
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Jenis Kelamin" name="gender" error={errors.gender} required>
            <select
              id="gender"
              name="gender"
              className="input"
              defaultValue={values.gender ?? ''}
              required
            >
              <option value="" disabled>
                Pilih...
              </option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </Field>
          <Field label="Jenjang Tujuan" name="level" error={errors.level} required>
            <select
              id="level"
              name="level"
              className="input"
              defaultValue={values.level ?? ''}
              required
            >
              <option value="" disabled>
                Pilih...
              </option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tempat Lahir" name="birthPlace" error={errors.birthPlace} required>
            <input
              id="birthPlace"
              name="birthPlace"
              defaultValue={values.birthPlace}
              className="input"
              required
            />
          </Field>
          <Field label="Tanggal Lahir" name="birthDate" error={errors.birthDate} required>
            <input
              id="birthDate"
              name="birthDate"
              defaultValue={values.birthDate}
              type="date"
              className="input"
              required
            />
          </Field>
          <Field label="NISN" name="nisn" error={errors.nisn}>
            <input
              id="nisn"
              name="nisn"
              defaultValue={values.nisn}
              className="input"
              inputMode="numeric"
            />
          </Field>
          <Field label="Asal Sekolah" name="previousSchool" error={errors.previousSchool} required>
            <input
              id="previousSchool"
              name="previousSchool"
              defaultValue={values.previousSchool}
              className="input"
              required
            />
          </Field>
        </div>
        <Field label="Alamat Lengkap" name="address" error={errors.address} required>
          <textarea
            id="address"
            name="address"
            defaultValue={values.address}
            rows={3}
            className="input"
            required
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-2 text-lg font-extrabold text-brand-950">
          Data Orang Tua / Wali
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama Orang Tua / Wali" name="parentName" error={errors.parentName} required>
            <input
              id="parentName"
              name="parentName"
              defaultValue={values.parentName}
              className="input"
              required
            />
          </Field>
          <Field label="Pekerjaan" name="parentOccupation" error={errors.parentOccupation}>
            <input
              id="parentOccupation"
              name="parentOccupation"
              defaultValue={values.parentOccupation}
              className="input"
            />
          </Field>
          <Field label="No. WhatsApp" name="parentPhone" error={errors.parentPhone} required>
            <input
              id="parentPhone"
              name="parentPhone"
              defaultValue={values.parentPhone}
              type="tel"
              className="input"
              placeholder="08xxxxxxxxxx"
              autoComplete="tel"
              required
            />
          </Field>
          <Field label="Email" name="parentEmail" error={errors.parentEmail}>
            <input
              id="parentEmail"
              name="parentEmail"
              defaultValue={values.parentEmail}
              type="email"
              className="input"
              autoComplete="email"
            />
          </Field>
        </div>
        <Field label="Catatan (opsional)" name="notes">
          <textarea
            id="notes"
            name="notes"
            defaultValue={values.notes}
            rows={3}
            className="input"
            placeholder="Pertanyaan atau informasi tambahan"
          />
        </Field>
      </fieldset>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-brand-700 px-8 py-4 font-bold text-white transition hover:bg-brand-800 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? 'Mengirim...' : 'Kirim Pendaftaran'}
      </button>
    </form>
  )
}
