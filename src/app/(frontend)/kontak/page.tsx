import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { getSiteSettings } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    title: 'Kontak',
    description: `Alamat, nomor telepon, WhatsApp, dan lokasi ${site.name}.`,
    alternates: { canonical: '/kontak' },
  }
}

export default async function ContactPage() {
  const site = await getSiteSettings()
  const mapsSrc = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapsQuery || site.name)}&output=embed`
  const contacts = [
    { label: 'Alamat', value: site.address },
    { label: 'Telepon', value: site.phone },
    { label: 'WhatsApp', value: site.whatsapp && `+${site.whatsapp}`, href: site.whatsapp && `https://wa.me/${site.whatsapp}` },
    { label: 'Email', value: site.email, href: site.email && `mailto:${site.email}` },
  ].filter((contact) => contact.value)

  return (
    <>
      <PageHeader eyebrow="Kontak" title="Hubungi Kami" subtitle="Silakan berkunjung atau hubungi kami untuk informasi lebih lanjut." />
      <section className="mx-auto grid max-w-[74rem] gap-3.5 px-3 pt-3.5 pb-16 sm:px-4 md:grid-cols-2">
        <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {contacts.map((contact) => (
            <div key={contact.label} className="card-bento p-6">
              <div className="text-sm font-semibold text-gold-600">{contact.label}</div>
              {contact.href ? (
                <a href={contact.href} className="mt-1 block font-semibold text-brand-900 hover:underline">{contact.value}</a>
              ) : (
                <div className="mt-1 font-semibold whitespace-pre-line text-brand-900">{contact.value}</div>
              )}
            </div>
          ))}
        </div>
        <iframe
          src={mapsSrc}
          className="min-h-96 w-full rounded-[28px] border-0 bg-white shadow-[0_1px_2px_rgb(16_24_19/0.04)]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Peta lokasi ${site.name}`}
        />
      </section>
    </>
  )
}
