import type { Metadata } from 'next'

import { GalleryLightbox, type GalleryPhoto } from '@/components/GalleryLightbox'
import { PageIntro } from '@/components/site/PageIntro'
import { formatDate, mediaUrl } from '@/lib/format'
import { getGallery, getPageTexts } from '@/lib/payload'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getPageTexts('galeri')
  return { title: t.introTitle, description: t.introSubtitle, alternates: { canonical: '/galeri' } }
}

export default async function GalleryPage() {
  const t = await getPageTexts('galeri')
  const gallery = await getGallery()
  const photos: GalleryPhoto[] = gallery.map((photo) => ({
    id: photo.id,
    title: photo.title,
    caption: photo.caption,
    thumb: mediaUrl(photo.image, 'card'),
    full: mediaUrl(photo.image, 'large'),
    date: formatDate(photo.date),
  }))

  return (
    <>
      <PageIntro eyebrow={t.introEyebrow} title={t.introTitle} subtitle={t.introSubtitle} />
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 md:py-28">
        {photos.length > 0 ? (
          <GalleryLightbox photos={photos} />
        ) : (
          <p className="py-20 text-center font-serif text-2xl text-[#0b2418]/50">Belum ada foto.</p>
        )}
      </section>
    </>
  )
}
