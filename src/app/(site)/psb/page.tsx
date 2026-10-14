import type { Metadata } from 'next'

import { Countdown } from '@/components/Countdown'
import { Rosette } from '@/components/geometri/Rosette'
import { RegistrationForm } from '@/components/psb/RegistrationForm'
import { PageIntro } from '@/components/site/PageIntro'
import { SectionHeading } from '@/components/site/SectionHeading'
import { formatDate, whatsappUrl } from '@/lib/format'
import { getAdmissions, getSiteSettings } from '@/lib/payload'

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
      <PageIntro
        eyebrow="PSB online"
        title={`Penerimaan Santri Baru ${admissions.academicYear}`}
        subtitle="Syarat, jadwal, biaya, dan formulir pendaftaran calon santri."
      />

      {/* Status pendaftaran */}
      <section className="mx-auto grid max-w-7xl gap-4 px-6 pt-16 sm:px-10 lg:grid-cols-12">
        <div
          data-reveal
          className="flex flex-col justify-between gap-6 rounded-[28px] bg-white p-8 md:flex-row md:items-center lg:col-span-8"
        >
          <div>
            <p className="text-sm text-[#0b2418]/55">Status pendaftaran</p>
            <p
              className={`mt-1 font-serif text-3xl font-semibold ${admissions.isOpen ? 'text-[#1f7f4a]' : 'text-[#0b2418]/50'}`}
            >
              {admissions.isOpen ? 'Pendaftaran dibuka' : 'Pendaftaran belum dibuka'}
            </p>
            <p className="mt-1 text-sm text-[#0b2418]/55">
              Ada pertanyaan? Hubungi panitia lewat WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {admissions.isOpen && (
              <a
                href="#formulir"
                className="rounded-full bg-[#165133] px-6 py-3 font-semibold text-white transition hover:bg-[#0b2418]"
              >
                Isi Formulir
              </a>
            )}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-[#165133] px-6 py-3 font-semibold text-[#165133] transition hover:bg-[#e9f2ec]"
              >
                Tanya Panitia
              </a>
            )}
          </div>
        </div>
        <div
          data-reveal
          className="relative isolate flex flex-col justify-between overflow-hidden rounded-[28px] bg-[#0b2418] p-8 text-[#f4efe1] lg:col-span-4"
        >
          <div className="rosette-mask pointer-events-none absolute -right-24 -bottom-24 -z-10 w-80 opacity-30">
            <Rosette className="h-auto w-full" />
          </div>
          <p className="text-sm text-[#f4efe1]/65">
            {admissions.closesAt ? 'Pendaftaran ditutup dalam' : 'Tahun ajaran'}
          </p>
          {admissions.closesAt ? (
            <div>
              <Countdown
                target={admissions.closesAt}
                className="mt-3 font-serif text-4xl font-semibold tabular-nums"
                daysClassName="mr-2 text-[#e1bb4c]"
                doneClassName="mt-3 font-serif text-2xl text-[#e1bb4c]"
              />
              <p className="mt-2 text-xs text-[#f4efe1]/50">{formatDate(admissions.closesAt)}</p>
            </div>
          ) : (
            <p className="mt-3 font-serif text-4xl font-semibold text-[#e1bb4c]">
              {admissions.academicYear}
            </p>
          )}
        </div>
      </section>

      {/* Alur pendaftaran */}
      {admissions.steps && admissions.steps.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-24 sm:px-10 md:pt-32">
          <SectionHeading eyebrow="Langkah demi langkah" title="Alur pendaftaran" />
          <ol className="grid border-t border-[#0b2418]/10 sm:grid-cols-2 lg:grid-cols-5">
            {admissions.steps.map((step, i) => (
              <li
                key={step.id ?? i}
                data-reveal
                className="border-b border-[#0b2418]/10 py-8 pr-6 lg:border-r lg:border-b-0 lg:pl-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="font-serif text-5xl font-semibold text-[#e1bb4c]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 text-lg font-semibold">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Syarat, jadwal, biaya */}
      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-3">
        <div data-reveal>
          <h2 className="font-serif text-3xl font-semibold">Persyaratan</h2>
          <ul className="mt-6 space-y-4">
            {admissions.requirements?.map((requirement, i) => (
              <li key={requirement.id ?? i} className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-[#e1bb4c]" />
                {requirement.text}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <h2 className="font-serif text-3xl font-semibold">Jadwal</h2>
          <ul className="mt-6">
            {admissions.schedule?.map((item, i) => (
              <li key={item.id ?? i} className="border-b border-[#0b2418]/10 py-4 first:pt-0">
                <div className="font-semibold">{item.activity}</div>
                <div className="mt-0.5 text-sm text-[#0b2418]/55">{item.time}</div>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <h2 className="font-serif text-3xl font-semibold">Rincian biaya</h2>
          <table className="mt-6 w-full">
            <tbody>
              {admissions.fees?.map((fee, i) => (
                <tr key={fee.id ?? i} className="border-b border-[#0b2418]/10">
                  <td className="py-4 pr-3 text-[#0b2418]/70">{fee.item}</td>
                  <td className="py-4 text-right font-serif text-xl font-semibold whitespace-nowrap">
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
        <section id="formulir" className="scroll-mt-28 border-t border-[#0b2418]/10 bg-white/50">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow="Daftar online" title="Formulir pendaftaran" />
              <p data-reveal className="-mt-4 leading-relaxed text-[#0b2418]/65">
                Isi data calon santri dengan benar. Kolom bertanda * wajib diisi. Setelah terkirim,
                Anda akan mendapat nomor pendaftaran dan panitia akan menghubungi lewat WhatsApp.
              </p>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-[0_24px_60px_-40px_rgb(11_36_24/0.5)] md:p-10 lg:col-span-8">
              <RegistrationForm levels={levels} whatsapp={site.whatsapp} />
            </div>
          </div>
        </section>
      )}
    </>
  )
}
