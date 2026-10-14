import type { Metadata } from 'next'

import { NewsCard } from '@/components/NewsCard'
import { PageHeader } from '@/components/PageHeader'
import { getPublishedNews } from '@/lib/payload'

export const metadata: Metadata = {
  alternates: { canonical: '/berita' },
  title: 'Berita',
  description: 'Berita dan kegiatan terbaru pondok pesantren.',
}

export default async function NewsListPage() {
  const posts = await getPublishedNews()

  return (
    <>
      <PageHeader eyebrow="Kabar pondok" title="Berita & Kegiatan" subtitle="Kabar terbaru dari lingkungan pondok." />
      <section className="mx-auto max-w-[74rem] px-3 pt-3.5 pb-16 sm:px-4">
        {posts.length > 0 ? (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="card-bento p-10 text-center text-slate-500">Belum ada berita.</div>
        )}
      </section>
    </>
  )
}
