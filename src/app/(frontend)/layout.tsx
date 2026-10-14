import type { Metadata } from 'next'
import { Amiri, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { JsonLd } from '@/components/JsonLd'
import { Logo } from '@/components/Logo'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { mediaUrl, whatsappUrl } from '@/lib/format'
import { getSiteSettings } from '@/lib/payload'
import { absoluteUrl, allowIndexing, siteUrl } from '@/lib/seo'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const amiri = Amiri({ subsets: ['arabic'], weight: '700', variable: '--font-amiri' })

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

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const site = await getSiteSettings()
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
    <html lang="id" className={`${jakarta.variable} ${amiri.variable}`}>
      {/* suppressHydrationWarning: ekstensi browser (mis. ColorZilla) sering menambah atribut ke <body> */}
      <body
        className="flex min-h-screen flex-col bg-paper font-sans text-slate-800 antialiased"
        suppressHydrationWarning
      >
        <Header logo={<Logo className="h-10 w-10" logo={site.logo} />} />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
        <WhatsAppButton href={waUrl} />
        <JsonLd data={organization} />
      </body>
    </html>
  )
}
