import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'

import { Rosette } from '@/components/geometri/Rosette'
import { ArchPhoto } from '@/components/site/ArchPhoto'
import { HeroSlideshow, type HeroSlide } from '@/components/site/HeroSlideshow'
import { SectionHeading } from '@/components/site/SectionHeading'
import {
  categoryLabels,
  focalPosition,
  formatDate,
  getMedia,
  mediaUrl,
  pickPhotos,
  whatsappUrl,
} from '@/lib/format'
import {
  getAdmissions,
  getGallery,
  getHomePage,
  getProgramPage,
  getPageTexts,
  getPublishedNews,
  getSiteSettings,
} from '@/lib/payload'

// Beranda (desain "Geometri Cahaya · versi pesantren"): terang, hangat, menampilkan santri,
// ciri khas pesantren, dan informasi penting untuk wali santri.
export const metadata: Metadata = { alternates: { canonical: '/' } }

const delay = (seconds: number) => ({ '--delay': `${seconds}s` }) as CSSProperties

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default async function HomePage() {
  const [site, home, program, admissions, news, gallery] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getProgramPage(),
    getAdmissions(),
    getPublishedNews(3),
    getGallery(),
  ])
  const [t, tp] = await Promise.all([getPageTexts('home'), getPageTexts('program')])

  const levelPhotos = pickPhotos(program.levels ?? [], gallery)

  // Slideshow hero: foto banner dari dashboard lebih dulu, lalu foto-foto galeri
  const heroSlides: HeroSlide[] = [
    ...(home.heroImage
      ? [
          {
            src: mediaUrl(home.heroImage, 'large'),
            alt: getMedia(home.heroImage)?.alt || site.name,
            title: getMedia(home.heroImage)?.alt || site.name,
          },
        ]
      : []),
    ...gallery.map((item) => ({
      src: mediaUrl(item.image, 'large'),
      alt: item.title,
      title: item.title,
    })),
  ]
    // Buang foto tanpa URL, lalu foto yang sama (mis. banner yang juga ada di galeri)
    .flatMap((slide) => (slide.src ? [{ ...slide, src: slide.src }] : []))
    .filter((slide, i, all) => all.findIndex((other) => other.src === slide.src) === i)
  const waUrl = whatsappUrl(
    site.whatsapp,
    `Assalamu'alaikum, saya ingin bertanya tentang ${site.name}.`,
  )
  const firstFee = admissions.fees?.[0]

  // Angka statistik: isian Beranda › Angka Statistik; jika kosong, dihitung otomatis
  const stats =
    home.stats && home.stats.length > 0
      ? home.stats.map((stat) => ({ value: stat.value, label: stat.label }))
      : [
          site.foundedYear ? { value: site.foundedYear, label: 'Berdiri sejak' } : null,
          program.levels?.length
            ? { value: String(program.levels.length), label: 'Jenjang & program' }
            : null,
          program.extracurriculars?.length
            ? { value: String(program.extracurriculars.length), label: 'Ekstrakurikuler' }
            : null,
        ].filter((stat): stat is { value: string; label: string } => stat !== null)

  const quickLinks = [
    {
      title: t.quickRegister,
      text: admissions.isOpen ? `PSB ${admissions.academicYear} dibuka` : 'Lihat info pendaftaran',
      href: '/psb#formulir',
      icon: <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />,
    },
    {
      title: t.quickFees,
      text: firstFee ? `${firstFee.item}: ${firstFee.amount}` : 'Biaya pendidikan & asrama',
      href: '/psb',
      icon: <path d="M2 7h20v10H2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 7v10M18 7v10" />,
    },
    {
      title: t.quickSchedule,
      text: admissions.schedule?.[0]?.activity ?? 'Tahapan seleksi santri baru',
      href: '/psb',
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      ),
    },
    {
      title: t.quickLocation,
      text: site.address?.split(',').slice(-2).join(',').trim() || 'Kunjungi pondok kami',
      href: '/kontak',
      icon: (
        <>
          <path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
    },
  ]

  return (
    <>
      {/* ===== Hero: teks + foto santri berbingkai lengkung ===== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pt-14 pb-20 sm:px-10 lg:grid-cols-12 lg:pt-20 lg:pb-28">
          <div className="lg:col-span-6">
            <p
              className="intro font-arabic text-2xl text-[#a6821c] sm:text-3xl"
              style={delay(0.05)}
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <p
              className="intro mt-6 text-xs font-semibold tracking-[0.35em] text-[#a6821c] uppercase"
              style={delay(0.15)}
            >
              {t.heroEyebrow}
            </p>
            <h1 className="mt-5 font-serif leading-[0.92] font-semibold">
              <span
                className="intro block text-[clamp(3.2rem,7vw,6.2rem)] tracking-[-0.01em]"
                style={delay(0.25)}
              >
                {t.heroTitle}
              </span>
              <span
                className="intro block text-[clamp(2.4rem,5vw,4.4rem)] text-[#1f7f4a] italic"
                style={delay(0.4)}
              >
                {t.heroTitleAccent}
              </span>
            </h1>
            <p
              className="intro mt-7 max-w-lg text-lg leading-relaxed text-[#0b2418]/70"
              style={delay(0.55)}
            >
              {home.heroSubtitle || site.tagline}
            </p>
            <div className="intro mt-9 flex flex-wrap items-center gap-4" style={delay(0.7)}>
              <Link
                href="/psb"
                className="group inline-flex items-center gap-3 rounded-full bg-[#165133] py-3.5 pr-3.5 pl-7 font-semibold text-white shadow-[0_14px_30px_-14px_rgb(22_81_51/0.8)] transition hover:bg-[#0b2418]"
              >
                {t.heroButton}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e1bb4c] text-[#0b2418] transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link href="/profil" className="link-line pb-0.5 font-semibold text-[#165133]">
                {t.heroLink}
              </Link>
            </div>
            {stats.length > 0 && (
              <div
                className="intro mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#0b2418]/10 pt-8"
                style={delay(0.85)}
              >
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="font-serif text-4xl font-semibold">{stat.value}</div>
                    <div className="mt-1 text-sm text-[#0b2418]/55">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative lg:col-span-6">
            {/* Ornamen samar di belakang bingkai */}
            <div className="rosette-mask pointer-events-none absolute top-1/2 left-1/2 w-[125%] -translate-x-1/2 -translate-y-1/2 opacity-[0.4]">
              <Rosette className="h-auto w-full" />
            </div>
            <HeroSlideshow
              slides={heroSlides}
              className="intro mx-auto aspect-[4/5] w-full max-w-[460px]"
            />
          </div>
        </div>
      </section>

      {/* ===== Akses cepat untuk orang tua ===== */}
      <section className="mx-auto -mt-8 max-w-7xl px-6 sm:px-10">
        <div className="grid gap-px overflow-hidden rounded-[28px] bg-[#0b2418]/10 shadow-[0_24px_60px_-40px_rgb(11_36_24/0.6)] sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              data-reveal
              style={delay(i * 0.08)}
              className="group flex items-start gap-4 bg-white p-6 transition hover:bg-[#fbf8ef]"
            >
              <span className="flex h-12 w-11 shrink-0 items-center justify-center rounded-t-full rounded-b-md bg-[#e9f2ec] text-[#165133] transition group-hover:bg-[#165133] group-hover:text-white">
                <Icon>{item.icon}</Icon>
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm text-[#0b2418]/55">{item.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Ciri khas pesantren (dari isian Keunggulan di dashboard) ===== */}
      {home.features && home.features.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-24 sm:px-10 md:pt-32">
          <SectionHeading
            eyebrow={t.featuresEyebrow}
            title={home.featuresHeading || 'Pendidikan yang menyeluruh'}
          />
          <div className="grid gap-px overflow-hidden rounded-[28px] bg-[#0b2418]/10 md:grid-cols-2 lg:grid-cols-4">
            {home.features.map((feature, i) => (
              <div
                key={feature.id ?? i}
                data-reveal
                style={delay(i * 0.08)}
                className="bg-[#f6f2e7] p-8"
              >
                <span className="font-serif text-5xl font-semibold text-[#e1bb4c]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-serif text-2xl font-semibold">{feature.title}</h3>
                {feature.description && (
                  <p className="mt-3 leading-relaxed text-[#0b2418]/65">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Jenjang pendidikan ===== */}
      {program.levels && program.levels.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
          <SectionHeading
            eyebrow={t.levelsEyebrow}
            title={t.levelsTitle}
            action={
              <Link
                href="/program"
                data-reveal
                className="link-line pb-0.5 font-semibold text-[#165133]"
              >
                Semua program →
              </Link>
            }
          />
          <div className="grid gap-8 md:grid-cols-3">
            {program.levels.map((level, i) => (
              <Link
                key={level.id ?? i}
                href="/program"
                data-reveal
                style={delay(i * 0.1)}
                className="group"
              >
                <ArchPhoto
                  {...levelPhotos[i]}
                  className="aspect-[4/5] transition duration-500 group-hover:-translate-y-1.5"
                />
                <div className="mt-6">
                  {level.label && (
                    <span className="text-xs font-semibold tracking-[0.2em] text-[#a6821c] uppercase">
                      {level.label}
                    </span>
                  )}
                  <h3 className="mt-2 font-serif text-3xl font-semibold group-hover:text-[#1f7f4a]">
                    {level.name}
                  </h3>
                  {level.description && (
                    <p className="mt-2 leading-relaxed text-[#0b2418]/65">{level.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== Sehari di pondok ===== */}
      {program.dailySchedule && program.dailySchedule.length > 0 && (
        <section className="relative isolate overflow-hidden bg-[#0b2418] text-[#f4efe1]">
          <div className="rosette-mask pointer-events-none absolute -right-40 -bottom-40 -z-10 w-[720px] opacity-20">
            <Rosette className="h-auto w-full" />
          </div>
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-12">
            <div className="lg:col-span-4" data-reveal>
              <p className="text-xs font-semibold tracking-[0.35em] text-[#e1bb4c] uppercase">
                {tp.dailyEyebrow}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-tight font-semibold md:text-5xl">
                {tp.dailyTitle}
              </h2>
              <p className="mt-5 leading-relaxed text-[#f4efe1]/65">{tp.dailyText}</p>
            </div>
            <ol className="relative grid gap-1 lg:col-span-8 lg:grid-cols-2 lg:gap-x-10">
              {program.dailySchedule.map((item, i) => (
                <li
                  key={item.id ?? i}
                  data-reveal
                  style={delay(i * 0.05)}
                  className="flex items-baseline gap-5 border-b border-[#f4efe1]/10 py-4"
                >
                  <span className="w-16 shrink-0 font-serif text-2xl text-[#e1bb4c] tabular-nums">
                    {item.time}
                  </span>
                  <span className="text-[#f4efe1]/85">{item.activity}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ===== Sambutan pimpinan ===== */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 sm:px-10 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <ArchPhoto
            src={mediaUrl(home.leaderPhoto, 'card')}
            alt={home.leaderName ?? 'Pimpinan pondok'}
            position={focalPosition(home.leaderPhoto)}
            className="mx-auto aspect-[4/5] max-w-sm"
          />
        </div>
        <div className="lg:col-span-7">
          <p
            data-reveal
            className="text-xs font-semibold tracking-[0.35em] text-[#a6821c] uppercase"
          >
            {t.welcomeEyebrow}
          </p>
          {home.welcomeHeading && (
            <h2
              data-reveal
              className="mt-4 font-serif text-2xl font-semibold text-[#1f7f4a] md:text-3xl"
            >
              {home.welcomeHeading}
            </h2>
          )}
          <p
            data-reveal
            style={delay(0.1)}
            className="mt-6 font-serif text-3xl leading-snug font-medium md:text-4xl"
          >
            “{home.welcomeBody || site.description}”
          </p>
          {home.leaderName && (
            <p data-reveal style={delay(0.2)} className="mt-8 font-semibold">
              {home.leaderName}
              <span className="block text-sm font-normal text-[#0b2418]/55">{t.leaderRole}</span>
            </p>
          )}
        </div>
      </section>

      {/* ===== Berita ===== */}
      {news.length > 0 && (
        <section className="border-t border-[#0b2418]/10 bg-white/50">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
            <SectionHeading
              eyebrow={t.newsEyebrow}
              title={t.newsTitle}
              action={
                <Link
                  href="/berita"
                  data-reveal
                  className="link-line pb-0.5 font-semibold text-[#165133]"
                >
                  Semua berita →
                </Link>
              }
            />
            <div className="grid gap-10 md:grid-cols-3">
              {news.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  data-reveal
                  style={delay(i * 0.1)}
                  className="group"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#e3ddc9]">
                    {mediaUrl(post.thumbnail, 'card') ? (
                      <img
                        src={mediaUrl(post.thumbnail, 'card')}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="stripes h-full w-full" />
                    )}
                  </div>
                  <p className="mt-5 text-xs font-semibold tracking-[0.15em] text-[#a6821c] uppercase">
                    {categoryLabels[post.category]} · {formatDate(post.publishedAt)}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-snug font-semibold group-hover:text-[#1f7f4a]">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Ajakan PSB ===== */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 md:py-32">
        <div
          data-reveal
          className="relative isolate overflow-hidden rounded-[36px] bg-[#165133] px-8 py-16 text-center text-white md:px-16 md:py-20"
        >
          <div className="rosette-mask pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-25">
            <Rosette className="h-auto w-full" />
          </div>
          <p className="text-xs font-semibold tracking-[0.35em] text-[#ecd27f] uppercase">
            {t.ctaEyebrow}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-4xl leading-tight font-semibold md:text-6xl">
            {t.ctaTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/75">
            {admissions.isOpen ? t.ctaOpenText : t.ctaClosedText}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/psb"
              className="rounded-full bg-[#e1bb4c] px-8 py-4 font-semibold text-[#0b2418] transition hover:bg-[#ecd27f]"
            >
              {admissions.isOpen ? 'Daftar Sekarang' : 'Info PSB'}
            </Link>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener"
                className="rounded-full border border-white/30 px-8 py-4 font-semibold transition hover:bg-white/10"
              >
                Tanya Panitia
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
