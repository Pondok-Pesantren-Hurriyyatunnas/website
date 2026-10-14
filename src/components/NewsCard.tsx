import Link from 'next/link'

import type { News } from '@/payload-types'
import { categoryLabels, formatDate, getMedia, mediaUrl } from '@/lib/format'
import { Logo } from './Logo'

// Kartu berita gaya bento: gambar membulat di dalam kartu putih
export function NewsCard({ post }: { post: News }) {
  const thumbnail = mediaUrl(post.thumbnail, 'card')

  return (
    <Link href={`/berita/${post.slug}`} className="card-bento group flex flex-col p-3 transition hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgb(16_59_38/0.4)]">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={getMedia(post.thumbnail)?.alt ?? post.title}
          loading="lazy"
          className="aspect-[16/10] w-full rounded-[20px] object-cover"
        />
      ) : (
        <div className="pattern-green flex aspect-[16/10] items-center justify-center rounded-[20px]">
          <Logo className="h-14 w-14 opacity-90" />
        </div>
      )}
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">
            {categoryLabels[post.category]}
          </span>
          <span className="text-slate-500">{formatDate(post.publishedAt)}</span>
        </div>
        <h3 className="mt-3 text-lg leading-snug font-bold text-brand-950 group-hover:text-brand-700">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700">
          Baca selengkapnya
          <span className="transition group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
