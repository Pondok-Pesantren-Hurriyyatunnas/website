import type { CSSProperties } from 'react'
import Link from 'next/link'

import { Countdown } from '@/components/Countdown'
import { MotionLayer } from '@/components/geometri/MotionLayer'
import { Rosette } from '@/components/geometri/Rosette'
import { Logo } from '@/components/Logo'
import { getAdmissions, getHomePage, getProgramPage, getSiteSettings } from '@/lib/payload'

// Mockup konsep "Geometri Cahaya" untuk beranda. Belum dipakai di beranda asli.
export const dynamic = 'force-dynamic'

const delay = (seconds: number) => ({ '--delay': `${seconds}s` }) as CSSProperties

export default async function GeometryConceptPage() {
  const [site, home, program, admissions] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getProgramPage(),
    getAdmissions(),
  ])

  const stats =
    home.stats && home.stats.length > 0
      ? home.stats.map((stat) => ({ value: stat.value, label: stat.label }))
      : [
          site.foundedYear ? { value: site.foundedYear, label: 'Tahun berdiri' } : null,
          program.levels?.length
            ? { value: String(program.levels.length), label: 'Jenjang & program' }
            : null,
          program.extracurriculars?.length
            ? { value: String(program.extracurriculars.length), label: 'Ekstrakurikuler' }
            : null,
        ].filter((stat): stat is { value: string; label: string } => stat !== null)

  return (
    <>
      <MotionLayer />

      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
        {/* Latar: hijau pekat dengan cahaya lembut */}
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(120%_80%_at_75%_40%,#0f3a26_0%,#06180f_45%,#030c07_100%)]" />
        <div className="star-tile absolute inset-0 -z-10 opacity-[0.035]" />

        {/* Ornamen bintang islami */}
        <div className="rosette-parallax rosette-mask pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[150vw] max-w-none -translate-x-1/2 -translate-y-[78%] opacity-40 sm:w-[110vw] sm:opacity-60 lg:top-[calc(50%+16px)] lg:left-auto lg:-right-[3vw] lg:w-[min(60vw,calc(100svh-150px))] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-100">
          <Rosette className="h-auto w-full" />
        </div>

        {/* Navigasi ringkas */}
        <header
          className="intro relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8"
          style={delay(3.2)}
        >
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-10" logo={site.logo} />
            <span className="font-serif text-xl font-semibold tracking-wide">Hurriyyatunnas</span>
          </Link>
          <nav className="hidden items-center gap-9 text-[13px] tracking-[0.18em] text-[#f4efe1]/70 uppercase md:flex">
            {[
              ['Profil', '/profil'],
              ['Program', '/program'],
              ['Berita', '/berita'],
              ['Galeri', '/galeri'],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="link-line pb-1 transition hover:text-[#f4efe1]"
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/psb"
            className="rounded-full border border-[#e1bb4c]/60 px-5 py-2.5 text-[13px] font-semibold tracking-[0.12em] text-[#ecd27f] uppercase transition hover:bg-[#e1bb4c] hover:text-[#04110b]"
          >
            Daftar
          </Link>
        </header>

        {/* Judul */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-14 sm:px-10 lg:justify-center lg:pb-0">
          <p className="intro font-arabic text-2xl text-[#e1bb4c] sm:text-3xl" style={delay(0.2)}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p
            className="intro mt-8 text-xs font-medium tracking-[0.45em] text-[#ecd27f]/80 uppercase sm:text-sm"
            style={delay(2.2)}
          >
            Pondok Pesantren
          </p>
          <h1 className="mt-4 font-serif leading-[0.86] font-semibold">
            <span
              className="intro block text-[clamp(3.6rem,11vw,10rem)] tracking-[-0.02em]"
              style={delay(2.45)}
            >
              Hurriyyatunnas
            </span>
            <span
              className="intro block text-[clamp(2.6rem,7.5vw,6.8rem)] text-[#e1bb4c] italic"
              style={delay(2.7)}
            >
              Bakti Awo
            </span>
          </h1>
          <p
            className="intro mt-8 max-w-md text-base leading-relaxed font-light text-[#f4efe1]/70 sm:text-lg"
            style={delay(3)}
          >
            {home.heroSubtitle || site.tagline}
          </p>
          <div
            className="intro mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            style={delay(3.2)}
          >
            <Link
              href="/psb"
              className="group inline-flex items-center gap-3 rounded-full bg-[#e1bb4c] py-3.5 pr-3.5 pl-7 font-semibold text-[#04110b] transition hover:bg-[#ecd27f]"
            >
              Daftar Santri Baru {admissions.academicYear}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#04110b] text-[#e1bb4c] transition group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              href="/profil"
              className="link-line pb-1 text-sm font-medium tracking-[0.12em] text-[#f4efe1]/80 uppercase"
            >
              Kenali Kami
            </Link>
          </div>
        </div>

        {/* Bilah bawah: status PSB & petunjuk gulir */}
        <div
          className="intro relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10"
          style={delay(3.6)}
        >
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-[#f4efe1]/12 pt-6">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm text-[#f4efe1]/60">
              <span className="tracking-[0.2em] text-[#ecd27f] uppercase">
                PSB {admissions.academicYear}
              </span>
              <span>{admissions.isOpen ? 'Pendaftaran dibuka' : 'Pendaftaran ditutup'}</span>
              {admissions.isOpen && admissions.closesAt && (
                <span className="flex items-baseline gap-2">
                  ditutup dalam
                  <Countdown
                    target={admissions.closesAt}
                    className="font-serif text-xl text-[#f4efe1] tabular-nums"
                    daysClassName="mr-1.5 text-[#e1bb4c]"
                  />
                </span>
              )}
            </div>
            <div className="hidden items-center gap-3 text-xs tracking-[0.3em] text-[#f4efe1]/40 uppercase sm:flex">
              Gulir
              <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-[#f4efe1]/15" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PERNYATAAN (editorial, latar gading) ================= */}
      <section className="bg-[#f6f2e7] text-[#0b2418]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-36">
          <div className="grid gap-14 lg:grid-cols-12">
            <p
              data-reveal
              className="text-xs font-semibold tracking-[0.4em] text-[#a6821c] uppercase lg:col-span-3 lg:pt-4"
            >
              Tentang Pondok
            </p>
            <div className="lg:col-span-9">
              <p
                data-reveal
                className="font-serif text-[clamp(2rem,4.4vw,3.9rem)] leading-[1.12] font-medium"
              >
                Tempat ilmu dan adab tumbuh bersama. Kami mendidik santri menjadi pribadi yang{' '}
                <em className="text-[#1f7f4a]">berilmu</em>,{' '}
                <em className="text-[#1f7f4a]">berakhlak mulia</em>, dan{' '}
                <em className="text-[#a6821c]">bermanfaat bagi umat</em>.
              </p>
              <Link
                href="/profil"
                data-reveal
                style={delay(0.15)}
                className="link-line mt-10 inline-block pb-1 text-sm font-semibold tracking-[0.15em] uppercase"
              >
                Profil lengkap →
              </Link>
            </div>
          </div>

          {stats.length > 0 && (
            <div
              className={`mt-24 grid grid-cols-2 border-t border-[#0b2418]/12 ${stats.length === 3 ? 'md:grid-cols-3' : stats.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-4'}`}
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  data-reveal
                  style={delay(i * 0.12)}
                  className="border-b border-[#0b2418]/12 py-10 pr-6 md:border-r md:border-b-0 md:last:border-r-0 md:[&:not(:first-child)]:pl-8"
                >
                  <div className="font-serif text-6xl leading-none font-medium md:text-7xl">
                    {stat.value}
                  </div>
                  <div className="mt-4 text-sm tracking-wide text-[#0b2418]/60">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= HADITS (pita gelap dengan ornamen kecil) ================= */}
      <section className="relative isolate overflow-hidden bg-[#04110b] py-28 text-center md:py-36">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[680px] -translate-x-1/2 -translate-y-1/2 opacity-25">
          <Rosette className="h-auto w-full" />
        </div>
        <div className="mx-auto max-w-3xl px-6">
          <p data-reveal className="font-arabic text-3xl leading-loose text-[#e1bb4c] sm:text-5xl">
            طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
          </p>
          <p
            data-reveal
            style={delay(0.15)}
            className="mt-8 font-serif text-2xl text-[#f4efe1] italic sm:text-3xl"
          >
            “Menuntut ilmu itu wajib atas setiap muslim.”
          </p>
          <p
            data-reveal
            style={delay(0.3)}
            className="mt-4 text-xs tracking-[0.35em] text-[#f4efe1]/50 uppercase"
          >
            HR. Ibnu Majah
          </p>
        </div>
      </section>

      <footer className="bg-[#04110b] px-6 pb-10 text-center text-xs tracking-[0.2em] text-[#f4efe1]/40 uppercase">
        Pratinjau konsep “Geometri Cahaya” ·{' '}
        <Link href="/" className="link-line text-[#ecd27f]">
          Kembali ke beranda
        </Link>
      </footer>
    </>
  )
}
