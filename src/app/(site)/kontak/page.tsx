import type { Metadata } from 'next'

import { PageIntro } from '@/components/site/PageIntro'
import { whatsappUrl } from '@/lib/format'
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
  const waUrl = whatsappUrl(
    site.whatsapp,
    `Assalamu'alaikum, saya ingin bertanya tentang ${site.name}.`,
  )
  const contacts = [
    { label: 'Alamat', value: site.address },
    { label: 'Telepon', value: site.phone },
    { label: 'WhatsApp', value: site.whatsapp && `+${site.whatsapp}`, href: waUrl },
    { label: 'Email', value: site.email, href: site.email && `mailto:${site.email}` },
  ].filter((contact) => contact.value)

  return (
    <>
      <PageIntro
        eyebrow="Kontak"
        title="Hubungi Kami"
        subtitle="Silakan berkunjung ke pondok atau hubungi kami untuk informasi pendaftaran dan kegiatan santri."
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <dl>
            {contacts.map((contact) => (
              <div
                key={contact.label}
                data-reveal
                className="border-b border-[#0b2418]/10 py-6 first:pt-0"
              >
                <dt className="text-xs font-semibold tracking-[0.3em] text-[#a6821c] uppercase">
                  {contact.label}
                </dt>
                <dd className="mt-2 font-serif text-2xl leading-snug font-semibold whitespace-pre-line">
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener"
                      className="link-line hover:text-[#1f7f4a]"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    contact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener"
              className="mt-10 inline-flex rounded-full bg-[#165133] px-7 py-3.5 font-semibold text-white transition hover:bg-[#0b2418]"
            >
              Chat WhatsApp
            </a>
          )}
        </div>
        <div className="lg:col-span-7" data-reveal>
          <iframe
            src={mapsSrc}
            className="h-full min-h-[420px] w-full rounded-[28px] border-0 bg-white"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Peta lokasi ${site.name}`}
          />
        </div>
      </section>
    </>
  )
}
