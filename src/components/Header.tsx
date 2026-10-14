'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import { navItems } from '@/lib/navigation'

// Navbar mengambang (kartu putih membulat), senada dengan header dashboard
export function Header({ logo }: { logo: ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  // '/old' adalah beranda desain lama: hanya aktif jika persis di halaman itu
  const isActive = (href: string) =>
    href === '/old' ? pathname === '/old' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white/90 shadow-[0_8px_30px_-12px_rgb(16_59_38/0.25)] ring-1 ring-black/5 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
          <Link href="/old" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            {logo}
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight text-brand-950">Hurriyyatunnas</div>
              <div className="text-xs font-semibold text-gold-600">Bakti Awo</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full bg-paper p-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-white text-brand-800 shadow-sm'
                    : 'text-slate-500 hover:text-brand-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/old/psb"
              className="hidden rounded-full bg-gradient-to-br from-brand-700 to-brand-900 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-12px_rgb(16_59_38/0.8)] transition hover:-translate-y-0.5 sm:inline-flex"
            >
              Daftar Santri Baru
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-brand-900 lg:hidden"
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                {isOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="grid gap-1 border-t border-black/5 p-3 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-2xl px-4 py-3 font-semibold ${isActive(item.href) ? 'bg-brand-50 text-brand-800' : 'text-slate-600'}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/old/psb"
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 px-4 py-3 text-center font-bold text-white"
            >
              Daftar Santri Baru
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
