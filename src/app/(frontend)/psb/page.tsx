import type { Metadata } from 'next'

import { Countdown } from '@/components/Countdown'
import { PageHeader } from '@/components/PageHeader'
import { formatDate, whatsappUrl } from '@/lib/format'
import { getAdmissions, getSiteSettings } from '@/lib/payload'
import { RegistrationForm } from './RegistrationForm'

export async function generateMetadata(): Promise<Metadata> {
  const admissions = await getAdmissions()
  return {
    title: `Penerimaan Santri Baru ${admissions.academicYear}`,
    description: `Info dan formulir pendaftaran santri baru tahun ajaran ${admissions.academicYear}: syarat, jadwal, biaya, dan daftar online.`,
    alternates: { canonical: '/psb' },
  }
}

export default async function AdmissionsPage() {
  const [site, admissions] = await Promise.all([getSiteSettings(), getAdmissions()])
  const waUrl = whatsappUrl(
    site.whatsapp,
    `Assalamu'alaikum, saya ingin bertanya tentang pendaftaran santri baru ${admissions.academicYear}.`,
  )
  const levels = (admissions.levels ?? []).map((level) => level.name)

  return (
    <>
      <PageHeader
        eyebrow="PSB online"
        title={`Penerimaan Santri Baru ${admissions.academicYear}`}
        subtitle="Syarat, jadwal, biaya, dan formulir pendaftaran online."
      />

      <div className="mx-auto max-w-[74rem] space-y-3.5 px-3 pt-3.5 pb-16 sm:px-4">
        {/* Status pendaftaran */}
        <section className="grid gap-3.5 lg:grid-cols-12">
          <div className="card-bento flex flex-col justify-between gap-6 p-7 md:flex-row md:items-center lg:col-span-8">
            <div>
              <p className="text-sm text-slate-500">Status pendaftaran</p>
              <p
                className={`mt-1 text-2xl font-bold tracking-tight ${admissions.isOpen ? 'text-brand-600' : 'text-slate-500'}`}
              >
                {admissions.isOpen
                  ? 'Pendaftaran sedang dibuka'
                  : 'Pendaftaran belum dibuka / sudah ditutup'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ada pertanyaan? Hubungi panitia lewat WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {admissions.isOpen && (
                <a
                  href="#formulir"
                  className="rounded-full bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5"
                >
                  Isi Formulir
                </a>
              )}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border-[1.5px] border-brand-800 px-6 py-3 font-bold text-brand-800 transition hover:bg-brand-50"
                >
                  Tanya Panitia
                </a>
              )}
            </div>
          </div>
          <div className="rings flex flex-col justify-between rounded-[28px] p-7 text-white lg:col-span-4">
            <p className="text-sm text-brand-100/70">
              {admissions.closesAt ? 'Pendaftaran ditutup dalam' : 'Tahun ajaran'}
            </p>
            {admissions.closesAt ? (
              <>
                <Countdown
                  target={admissions.closesAt}
                  className="mt-3 text-4xl font-bold tracking-tight tabular-nums"
                  daysClassName="mr-2 text-gold-300"
                  doneClassName="mt-3 text-xl font-bold text-gold-300"
                />
                <p className="mt-2 text-xs text-brand-100/60">{formatDate(admissions.closesAt)}</p>
              </>
            ) : (
              <p className="mt-3 text-4xl font-bold tracking-tight text-gold-300">
                {admissions.academicYear}
              </p>
            )}
          </div>
        </section>

        {/* Alur pendaftaran */}
        {admissions.steps && admissions.steps.length > 0 && (
          <section className="pt-10">
            <p className="text-sm font-semibold tracking-[0.15em] text-gold-600 uppercase">
              Langkah demi langkah
            </p>
            <h2 className="mt-1 mb-6 text-3xl font-bold tracking-tight text-brand-950">
              Alur Pendaftaran
            </h2>
            <ol className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
              {admissions.steps.map((step, i) => (
                <li
                  key={step.id ?? i}
                  className={`flex flex-col rounded-[24px] p-5 ${i === 0 ? 'bg-gradient-to-br from-brand-700 to-brand-950 text-white' : 'card-bento'}`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${i === 0 ? 'bg-gold-400 text-brand-950' : 'bg-brand-50 text-brand-700'}`}
                  >
                    {i + 1}
                  </span>
                  <p className={`mt-8 font-bold ${i === 0 ? 'text-white' : 'text-brand-950'}`}>
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Syarat, jadwal, biaya */}
        <section className="grid gap-3.5 pt-10 lg:grid-cols-3">
          <div className="card-bento p-7">
            <h2 className="text-xl font-bold text-brand-950">Persyaratan</h2>
            <ul className="mt-5 space-y-3 text-slate-700">
              {admissions.requirements?.map((requirement, i) => (
                <li key={requirement.id ?? i} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                    ✓
                  </span>
                  {requirement.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="card-bento p-7">
            <h2 className="text-xl font-bold text-brand-950">Jadwal</h2>
            <ul className="mt-5 space-y-2">
              {admissions.schedule?.map((item, i) => (
                <li key={item.id ?? i} className="rounded-2xl bg-paper px-4 py-3">
                  <div className="font-semibold text-brand-950">{item.activity}</div>
                  <div className="text-sm text-slate-500">{item.time}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-bento p-7">
            <h2 className="text-xl font-bold text-brand-950">Rincian Biaya</h2>
            <table className="mt-5 w-full text-sm">
              <tbody>
                {admissions.fees?.map((fee, i) => (
                  <tr key={fee.id ?? i} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-2 text-slate-600">{fee.item}</td>
                    <td className="py-3 text-right font-bold whitespace-nowrap text-brand-950">
                      {fee.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Formulir */}
        {admissions.isOpen && (
          <section id="formulir" className="scroll-mt-28 pt-10">
            <div className="grid gap-3.5 lg:grid-cols-12">
              <div className="rings flex flex-col rounded-[28px] p-8 text-white lg:col-span-4">
                <p className="text-sm font-semibold tracking-[0.15em] text-gold-400 uppercase">
                  Daftar online
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">Formulir Pendaftaran</h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-100/75">
                  Isi data dengan benar. Kolom bertanda * wajib diisi. Setelah terkirim, Anda akan
                  mendapat nomor pendaftaran dan panitia akan menghubungi lewat WhatsApp.
                </p>
              </div>
              <div className="card-bento p-6 md:p-10 lg:col-span-8">
                <RegistrationForm levels={levels} whatsapp={site.whatsapp} />
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
