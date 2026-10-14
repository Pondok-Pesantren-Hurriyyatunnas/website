import type { Metadata } from 'next'
import { Amiri, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { MotionLayer } from '@/components/geometri/MotionLayer'
import { JsonLd } from '@/components/JsonLd'
import { Logo } from '@/components/Logo'
import { SiteFooter } from '@/components/site/SiteFooter'
import { LivePreviewListener } from '@/components/site/LivePreviewListener'
import { SiteHeader } from '@/components/site/SiteHeader'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { mediaUrl, whatsappUrl } from '@/lib/format'
import { getAdmissions, getSiteSettings } from '@/lib/payload'
import { absoluteUrl, allowIndexing, siteUrl } from '@/lib/seo'
import '../(frontend)/globals.css'
import './site.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const amiri = Amiri({ subsets: ['arabic'], weight: '700', variable: '--font-amiri' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

// Konten dibangun ulang otomatis saat diubah di dashboard; ini cadangan tiap 1 jam
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: site.description ?? undefined,
    icons: { icon: '/favicon.svg' },
    openGraph: { siteName: site.name, type: 'website', locale: 'id_ID' },
    robots: allowIndexing ? undefined : { index: false, follow: false },
  }
}

// Layout utama website (desain "Geometri Cahaya · versi pesantren")
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [site, admissions] = await Promise.all([getSiteSettings(), getAdmissions()])
  const waUrl = whatsappUrl(
    site.whatsapp,
    `Assalamu'alaikum, saya ingin bertanya tentang ${site.name}.`,
  )
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: site.name,
    alternateName: site.shortName || undefined,
    description: site.description || undefined,
    url: siteUrl,
    logo: mediaUrl(site.logo) ?? absoluteUrl('/favicon.svg'),
    foundingDate:
      site.foundedYear && /^\d{4}$/.test(site.foundedYear) ? site.foundedYear : undefined,
    address: site.address
      ? { '@type': 'PostalAddress', streetAddress: site.address, addressCountry: 'ID' }
      : undefined,
    telephone: site.phone || undefined,
    email: site.email || undefined,
    sameAs: [site.instagram, site.facebook, site.youtube].filter(Boolean),
  }

  return (
    <html lang="id" className={`${jakarta.variable} ${amiri.variable} ${cormorant.variable}`}>
      <body
        className="flex min-h-screen flex-col bg-[#f6f2e7] font-sans text-[#0b2418] antialiased"
        suppressHydrationWarning
      >
        <MotionLayer />
        <LivePreviewListener />
        <SiteHeader
          logo={<Logo className="h-11 w-11" logo={site.logo} />}
          academicYear={admissions.academicYear}
          isOpen={Boolean(admissions.isOpen)}
          closesAt={admissions.closesAt}
          waUrl={waUrl}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter site={site} />
        <WhatsAppButton href={waUrl} />
        <JsonLd data={organization} />
      </body>
    </html>
  )
}
