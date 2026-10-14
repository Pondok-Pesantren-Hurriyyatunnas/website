import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { RichText } from '@/components/RichText'
import { categoryLabels, formatDate, getMedia, mediaUrl } from '@/lib/format'
import { getNewsBySlug, getPublishedNews, getSiteSettings } from '@/lib/payload'
import { absoluteUrl } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await getPublishedNews()
  return posts.filter((post) => post.slug).map((post) => ({ slug: post.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getNewsBySlug((await params).slug)
  if (!post) return {}
  const image = mediaUrl(post.thumbnail, 'large')
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/berita/${post.slug}` },
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: image ? [image] : undefined,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const post = await getNewsBySlug((await params).slug)
  if (!post) notFound()

  const [site, allNews] = await Promise.all([getSiteSettings(), getPublishedNews(4)])
  const others = allNews.filter((item) => item.id !== post.id).slice(0, 3)
  const thumbnail = mediaUrl(post.thumbnail, 'large')
  const article = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt || undefined,
    image: thumbnail ? [thumbnail] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: absoluteUrl(`/berita/${post.slug}`),
    author: { '@type': 'Organization', name: site.name },
    publisher: { '@type': 'Organization', name: site.name },
  }

  return (
    <article>
      <JsonLd data={article} />
      <header className="mx-auto max-w-4xl px-6 pt-14 text-center sm:px-10 md:pt-20">
        <Link href="/berita" className="link-line pb-0.5 text-sm font-semibold text-[#165133]">
          ← Semua berita
        </Link>
        <p className="intro mt-10 text-xs font-semibold tracking-[0.2em] text-[#a6821c] uppercase">
          {categoryLabels[post.category]} · {formatDate(post.publishedAt)}
        </p>
        <h1 className="intro mt-5 font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05] font-semibold">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="intro mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#0b2418]/65">
            {post.excerpt}
          </p>
        )}
      </header>

      {thumbnail && (
        <div className="mx-auto mt-12 max-w-6xl px-6 sm:px-10">
          <img
            src={thumbnail}
            alt={getMedia(post.thumbnail)?.alt ?? post.title}
            className="w-full rounded-[28px]"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-16 text-lg sm:px-10 md:py-20">
        <RichText data={post.content} />
      </div>

      {others.length > 0 && (
        <section className="border-t border-[#0b2418]/10 bg-white/50">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
            <p className="text-xs font-semibold tracking-[0.35em] text-[#a6821c] uppercase">
              Berita lainnya
            </p>
            <div className="mt-8 grid gap-10 md:grid-cols-3">
              {others.map((item) => (
                <Link key={item.id} href={`/berita/${item.slug}`} className="group">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#e3ddc9]">
                    {mediaUrl(item.thumbnail, 'card') ? (
                      <img
                        src={mediaUrl(item.thumbnail, 'card')}
                        alt={getMedia(item.thumbnail)?.alt ?? item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="stripes h-full w-full" />
                    )}
                  </div>
                  <h3 className="mt-4 font-serif text-2xl leading-snug font-semibold group-hover:text-[#1f7f4a]">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
