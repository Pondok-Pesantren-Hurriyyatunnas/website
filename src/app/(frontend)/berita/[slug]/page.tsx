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

  const thumbnail = mediaUrl(post.thumbnail, 'large')
  const site = await getSiteSettings()
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
    <article className="mx-auto max-w-[74rem] px-3 pt-4 pb-16 sm:px-4">
      <div className="card-bento mx-auto max-w-3xl p-6 md:p-12">
        <JsonLd data={article} />
        <Link href="/berita" className="text-sm font-semibold text-brand-700 hover:underline">
          ← Kembali ke berita
        </Link>
        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700">{categoryLabels[post.category]}</span>
          <span className="text-slate-500">{formatDate(post.publishedAt)}</span>
        </div>
        <h1 className="mt-4 text-3xl leading-tight font-extrabold text-brand-950 md:text-4xl">{post.title}</h1>
        {thumbnail && (
          <img src={thumbnail} alt={getMedia(post.thumbnail)?.alt ?? post.title} className="mt-8 w-full rounded-[24px]" />
        )}
        <div className="mt-8">
          <RichText data={post.content} />
        </div>
      </div>
    </article>
  )
}
