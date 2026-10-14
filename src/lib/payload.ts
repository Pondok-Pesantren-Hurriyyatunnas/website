import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { resolvePageTexts, type PageKey } from './page-texts'

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

const getPageTextsGlobal = cache(async () =>
  (await getPayloadClient()).findGlobal({ slug: 'page-texts', depth: 0 }),
)

/** Teks halaman dari dashboard (Teks Halaman), dengan nilai bawaan untuk isian kosong. */
export const getPageTexts = async <P extends PageKey>(page: P) => {
  const [stored, site, admissions] = await Promise.all([
    getPageTextsGlobal(),
    getSiteSettings(),
    getAdmissions(),
  ])
  return resolvePageTexts(
    page,
    (stored as unknown as Record<string, Record<string, unknown> | undefined>)[page],
    {
      nama: site.name,
      tahun: admissions.academicYear,
    },
  )
}

export const getPublishedNews = cache(async (limit = 100) => {
  const { docs } = await (
    await getPayloadClient()
  ).find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return docs
})

export const getNewsBySlug = cache(async (slug: string) => {
  const { docs } = await (
    await getPayloadClient()
  ).find({
    collection: 'news',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getGallery = cache(async () => {
  const { docs } = await (
    await getPayloadClient()
  ).find({
    collection: 'gallery',
    sort: '-date',
    limit: 200,
    depth: 1,
  })
  return docs
})
