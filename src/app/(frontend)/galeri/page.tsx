import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'
import { formatDate, mediaUrl } from '@/lib/format'
import { getGallery } from '@/lib/payload'
import { GalleryLightbox, type GalleryPhoto } from './GalleryLightbox'

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
      <PageHeader
        eyebrow="Dokumentasi"
        title="Galeri"
        subtitle="Dokumentasi kegiatan dan fasilitas pondok."
      />
      <section className="mx-auto max-w-[74rem] px-3 pt-3.5 pb-16 sm:px-4">
        {photos.length > 0 ? (
          <GalleryLightbox photos={photos} />
        ) : (
          <div className="card-bento p-12 text-center text-slate-500">Belum ada foto.</div>
        )}
      </section>
    </>
  )
}
