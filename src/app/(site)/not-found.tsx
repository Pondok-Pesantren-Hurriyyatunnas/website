import Link from 'next/link'

import { Rosette } from '@/components/geometri/Rosette'

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="rosette-mask pointer-events-none absolute top-1/2 left-1/2 -z-10 w-[640px] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]">
        <Rosette className="h-auto w-full" />
      </div>
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-serif text-8xl font-semibold text-[#e1bb4c]">404</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold">Halaman tidak ditemukan</h1>
        <p className="mt-4 text-[#0b2418]/60">
          Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-[#165133] px-7 py-3.5 font-semibold text-white transition hover:bg-[#0b2418]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
