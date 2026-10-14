'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import { Countdown } from '@/components/Countdown'
import { siteNav } from '@/lib/site-nav'

type Props = {
  logo: ReactNode
  academicYear: string
  isOpen: boolean
  closesAt?: string | null
  waUrl?: string
}

// Bilah info PSB + navigasi utama desain pesantren
export function SiteHeader({ logo, academicYear, isOpen, closesAt, waUrl }: Props) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <div className="bg-[#0b2418] text-[13px] text-[#f4efe1]/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2.5 sm:px-10">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <Link href="/psb" className="font-semibold text-[#ecd27f] hover:text-white">
              PSB {academicYear}
            </Link>
            <span>{isOpen ? '· Pendaftaran dibuka' : '· Pendaftaran ditutup'}</span>
            {isOpen && closesAt && (
              <span className="flex items-baseline gap-1.5">
                · ditutup dalam
                <Countdown
                  target={closesAt}
                  className="font-semibold text-white tabular-nums"
                  daysClassName="mr-1"
                />
              </span>
            )}
          </div>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener"
              className="hidden font-semibold text-[#ecd27f] hover:text-white sm:inline"
            >
              Tanya via WhatsApp →
            </a>
          )}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#0b2418]/8 bg-[#f6f2e7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
            {logo}
            <span className="leading-tight">
              <span className="block font-serif text-xl font-semibold text-[#0b2418]">
                Hurriyyatunnas
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap text-[#a6821c] uppercase sm:text-[11px] sm:tracking-[0.2em]">
                Pondok Pesantren
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {siteNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`link-line pb-0.5 transition ${
                  isActive(item.href) ? 'text-[#0b2418]' : 'text-[#0b2418]/65 hover:text-[#0b2418]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/psb"
              className="rounded-full bg-[#165133] px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-[#0b2418]"
            >
              Daftar<span className="hidden sm:inline"> Sekarang</span>
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0b2418]/15 text-[#0b2418] lg:hidden"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-[#0b2418]/8 px-6 pt-2 pb-6 lg:hidden">
            {[{ href: '/', label: 'Beranda' }, ...siteNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-between border-b border-[#0b2418]/8 py-4 font-serif text-2xl ${
                  pathname === item.href || (item.href !== '/' && isActive(item.href))
                    ? 'text-[#1f7f4a]'
                    : 'text-[#0b2418]'
                }`}
              >
                {item.label}
                <span className="text-base text-[#a6821c]">→</span>
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
