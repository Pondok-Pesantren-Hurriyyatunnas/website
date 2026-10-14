import type { MetadataRoute } from 'next'

import { getPublishedNews } from '@/lib/payload'
import { absoluteUrl } from '@/lib/seo'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getPublishedNews()
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/psb'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/profil'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/program'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/berita'), changeFrequency: 'daily', priority: 0.7 },
    { url: absoluteUrl('/galeri'), changeFrequency: 'weekly', priority: 0.5 },
    { url: absoluteUrl('/kontak'), changeFrequency: 'yearly', priority: 0.5 },
  ]
  return [
    ...staticPages,
    ...news
      .filter((post) => post.slug)
      .map((post) => ({
        url: absoluteUrl(`/berita/${post.slug}`),
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
  ]
}
