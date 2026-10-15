import type { Gallery, Media, News } from '@/payload-types'

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Makassar', // WITA (Wajo, Sulawesi Selatan)
  })

export const categoryLabels: Record<News['category'], string> = {
  activity: 'Kegiatan',
  announcement: 'Pengumuman',
  achievement: 'Prestasi',
  study: 'Kajian',
  article: 'Artikel',
}

type ImageSize = keyof NonNullable<Media['sizes']>

// Relasi upload bisa berupa ID (belum di-populate) atau objek Media
export const getMedia = (value: string | Media | null | undefined) =>
  value && typeof value === 'object' ? value : null

export const mediaUrl = (value: string | Media | null | undefined, size?: ImageSize) => {
  const media = getMedia(value)
  if (!media) return undefined
  return (size && media.sizes?.[size]?.url) || media.url || undefined
}

export const whatsappUrl = (number: string | null | undefined, message: string) =>
  number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined

/** Teks alt dari deskripsi Media yang diisi admin, atau teks cadangan. */
export const mediaAlt = (value: string | Media | null | undefined, fallback: string) =>
  getMedia(value)?.alt?.trim() || fallback

/** Posisi potong foto (object-position) dari titik fokus yang diatur admin di Media. */
export const focalPosition = (value: string | Media | null | undefined) => {
  const media = getMedia(value)
  return media?.focalX != null && media?.focalY != null
    ? `${media.focalX}% ${media.focalY}%`
    : undefined
}

export type PickedPhoto = { src?: string; alt: string; position?: string }

/**
 * Foto untuk sekumpulan item (mis. jenjang): pakai foto yang dipilih admin; item tanpa foto
 * diisi foto Galeri berurutan, tanpa mengulang foto yang sudah dipakai item lain.
 */
export function pickPhotos(
  items: { photo?: string | Media | null; name: string }[],
  gallery: Gallery[],
  size: ImageSize = 'card',
): PickedPhoto[] {
  const used = new Set(
    items.map((item) => getMedia(item.photo)?.id).filter((id): id is string => Boolean(id)),
  )
  const spare = gallery
    .map((entry) => entry.image)
    .filter((image) => {
      const id = getMedia(image)?.id
      if (!id || used.has(id)) return false
      used.add(id)
      return true
    })
  let next = 0
  return items.map((item) => {
    const media = getMedia(item.photo) ?? (spare.length ? spare[next++ % spare.length] : null)
    return {
      src: mediaUrl(media, size),
      alt: mediaAlt(media, item.name),
      position: focalPosition(media),
    }
  })
}
