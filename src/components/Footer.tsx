import Link from 'next/link'

import { navItems } from '@/lib/navigation'
import type { SiteSetting } from '@/payload-types'
import { Logo } from './Logo'

// Footer berbentuk kartu gelap bertekstur, senada dengan kartu gelap di dashboard
export function Footer({ site }: { site: SiteSetting }) {
  const year = new Date().getFullYear()
  const socials = [
    { href: site.instagram, label: 'Instagram' },
    { href: site.facebook, label: 'Facebook' },
    { href: site.youtube, label: 'YouTube' },
  ].filter((social) => social.href)

  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="rings mx-auto max-w-6xl overflow-hidden rounded-[32px] text-brand-100">
        <div className="grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12" logo={site.logo} />
              <div className="leading-tight">
                <div className="text-lg font-extrabold text-white">Hurriyyatunnas</div>
                <div className="text-sm font-semibold text-gold-400">Bakti Awo</div>
              </div>
            </div>
            {site.tagline && <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-100/75">{site.tagline}</p>}
            <Link
              href="/psb"
              className="mt-6 inline-flex rounded-full bg-gold-400 px-5 py-2.5 text-sm font-bold text-brand-950 transition hover:bg-gold-300"
            >
              Daftar Santri Baru →
            </Link>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.15em] text-gold-400 uppercase">Jelajahi</h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-brand-100/80 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/psb" className="text-brand-100/80 transition hover:text-white">
                  PSB
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.15em] text-gold-400 uppercase">Kontak</h3>
            <ul className="space-y-2.5 text-sm text-brand-100/80">
              {site.address && <li className="whitespace-pre-line">{site.address}</li>}
              {site.phone && <li>Telp. {site.phone}</li>}
              {site.email && <li>{site.email}</li>}
            </ul>
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-brand-100/50 sm:px-10">
          © {year} {site.name}. Hak cipta dilindungi.
        </div>
      </div>
    </footer>
  )
}
