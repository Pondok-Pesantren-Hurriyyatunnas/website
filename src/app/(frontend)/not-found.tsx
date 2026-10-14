import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-3 py-16 text-center sm:px-4">
      <div className="card-bento p-10 md:p-14">
        <p className="text-7xl font-bold tracking-tight text-brand-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-brand-950">Halaman tidak ditemukan</h1>
        <Link href="/" className="mt-8 inline-block rounded-full bg-gradient-to-br from-brand-700 to-brand-900 px-6 py-3 font-semibold text-white">
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}
