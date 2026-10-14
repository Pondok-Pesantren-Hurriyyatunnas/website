import type { Metadata } from 'next'

import { GalleryLightbox, type GalleryPhoto } from '@/components/GalleryLightbox'
import { PageIntro } from '@/components/site/PageIntro'
import { formatDate, mediaUrl } from '@/lib/format'
import { getGallery } from '@/lib/payload'

export const metadata: Metadata = {
  alternates: { canonical: '/galeri' },
  title: 'Galeri',
  description: 'Galeri foto kegiatan dan fasilitas pondok.',
}

export default async function GalleryPage() {
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
      <PageIntro
        eyebrow="Dokumentasi"
        title="Galeri"
        subtitle="Potret kegiatan santri dan suasana pondok. Klik foto untuk melihat lebih besar."
      />
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
