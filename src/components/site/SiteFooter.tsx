import Link from 'next/link'

import { Rosette } from '@/components/geometri/Rosette'
import { Logo } from '@/components/Logo'
import { siteNav } from '@/lib/site-nav'
import type { SiteSetting } from '@/payload-types'

export function SiteFooter({ site }: { site: SiteSetting }) {
  const year = new Date().getFullYear()
  const socials = [
    { href: site.instagram, label: 'Instagram' },
    { href: site.facebook, label: 'Facebook' },
    { href: site.youtube, label: 'YouTube' },
  ].filter((social) => social.href)

  return (
    <footer className="relative isolate overflow-hidden bg-[#0b2418] text-[#f4efe1]">
      <div className="rosette-mask pointer-events-none absolute -bottom-64 -left-48 -z-10 w-[680px] opacity-[0.14]">
        <Rosette className="h-auto w-full" />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" logo={site.logo} />
            <div className="leading-tight">
              <div className="font-serif text-2xl font-semibold">Hurriyyatunnas</div>
              <div className="text-[11px] font-semibold tracking-[0.2em] text-[#e1bb4c] uppercase">
                Pondok Pesantren · Bakti Awo
              </div>
            </div>
          </div>
          {site.tagline && (
            <p className="mt-6 max-w-sm font-serif text-xl leading-snug text-[#f4efe1]/80 italic">
              “{site.tagline}”
            </p>
          )}
          <Link
            href="/psb"
            className="mt-8 inline-flex rounded-full bg-[#e1bb4c] px-6 py-3 text-sm font-semibold text-[#0b2418] transition hover:bg-[#ecd27f]"
          >
            Daftarkan Calon Santri →
          </Link>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold tracking-[0.3em] text-[#e1bb4c] uppercase">
            Jelajahi
          </h3>
          <ul className="mt-5 grid gap-3 text-sm">
            {[{ href: '/', label: 'Beranda' }, ...siteNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line text-[#f4efe1]/75 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold tracking-[0.3em] text-[#e1bb4c] uppercase">
            Kontak
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-[#f4efe1]/75">
            {site.address && <li className="whitespace-pre-line">{site.address}</li>}
            {site.phone && <li>Telp. {site.phone}</li>}
            {site.email && <li>{site.email}</li>}
          </ul>
          {socials.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href!}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-[#f4efe1]/15 px-4 py-1.5 text-xs font-semibold transition hover:bg-[#f4efe1]/10"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-[#f4efe1]/10 px-6 py-6 text-center text-xs text-[#f4efe1]/45">
        © {year} {site.name}. Hak cipta dilindungi.
      </div>
    </footer>
  )
}
