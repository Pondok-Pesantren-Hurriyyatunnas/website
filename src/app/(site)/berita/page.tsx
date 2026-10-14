import type { Metadata } from 'next'
import Link from 'next/link'

import { PageIntro } from '@/components/site/PageIntro'
import { categoryLabels, formatDate, getMedia, mediaUrl } from '@/lib/format'
import { getPublishedNews } from '@/lib/payload'
import type { News } from '@/payload-types'

export const metadata: Metadata = {
  alternates: { canonical: '/berita' },
  title: 'Berita',
  description: 'Berita dan kegiatan terbaru pondok pesantren.',
}

function Meta({ post, light = false }: { post: News; light?: boolean }) {
  return (
    <p
      className={`text-xs font-semibold tracking-[0.15em] uppercase ${light ? 'text-[#ecd27f]' : 'text-[#a6821c]'}`}
    >
      {categoryLabels[post.category]} · {formatDate(post.publishedAt)}
    </p>
  )
}

export default async function NewsListPage() {
  const [featured, ...posts] = await getPublishedNews()

  return (
    <>
      <PageIntro
        eyebrow="Kabar pondok"
        title="Berita & Kegiatan"
        subtitle="Kabar terbaru dari kehidupan santri, kegiatan, dan pengumuman pondok."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 md:py-28">
        {featured ? (
          <>
            <Link
              href={`/berita/${featured.slug}`}
              data-reveal
              className="group grid items-center gap-10 lg:grid-cols-12"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-[28px] bg-[#e3ddc9] lg:col-span-7">
                {mediaUrl(featured.thumbnail, 'large') ? (
                  <img
                    src={mediaUrl(featured.thumbnail, 'large')}
                    alt={getMedia(featured.thumbnail)?.alt ?? featured.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="stripes h-full w-full" />
                )}
              </div>
              <div className="lg:col-span-5">
                <Meta post={featured} />
                <h2 className="mt-4 font-serif text-4xl leading-tight font-semibold group-hover:text-[#1f7f4a] md:text-5xl">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-5 text-lg leading-relaxed text-[#0b2418]/65">
                    {featured.excerpt}
                  </p>
                )}
                <span className="link-line mt-6 inline-block pb-0.5 font-semibold text-[#165133]">
                  Baca selengkapnya →
                </span>
              </div>
            </Link>

            {posts.length > 0 && (
              <div className="mt-20 grid gap-x-10 gap-y-16 border-t border-[#0b2418]/10 pt-16 md:grid-cols-3">
                {posts.map((post) => (
                  <Link key={post.id} href={`/berita/${post.slug}`} data-reveal className="group">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#e3ddc9]">
                      {mediaUrl(post.thumbnail, 'card') ? (
                        <img
                          src={mediaUrl(post.thumbnail, 'card')}
                          alt={getMedia(post.thumbnail)?.alt ?? post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="stripes h-full w-full" />
                      )}
                    </div>
                    <div className="mt-5">
                      <Meta post={post} />
                    </div>
                    <h3 className="mt-2 font-serif text-2xl leading-snug font-semibold group-hover:text-[#1f7f4a]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-[#0b2418]/60">{post.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="py-20 text-center font-serif text-2xl text-[#0b2418]/50">
            Belum ada berita.
          </p>
        )}
      </section>
    </>
  )
}
