import type { MetadataRoute } from 'next'

import { absoluteUrl, allowIndexing } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
