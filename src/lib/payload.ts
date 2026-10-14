import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getPayloadClient = () => getPayload({ config })

// `cache` mencegah query yang sama dijalankan berulang dalam satu render halaman
export const getSiteSettings = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'site-settings', depth: 1 }),
)

export const getHomePage = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'home-page', depth: 1 }),
)

export const getProfilePage = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'profile-page', depth: 1 }),
)

export const getProgramPage = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'program-page', depth: 1 }),
)

export const getAdmissions = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'admissions', depth: 0 }),
)

export const getPublishedNews = cache(async (limit = 100) => {
  const { docs } = await (await getPayloadClient()).find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
})

export const getNewsBySlug = cache(async (slug: string) => {
  const { docs } = await (await getPayloadClient()).find({
    collection: 'news',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getGallery = cache(async () => {
  const { docs } = await (await getPayloadClient()).find({
    collection: 'gallery',
    sort: '-date',
    limit: 200,
    depth: 1,
  })
  return docs
})
