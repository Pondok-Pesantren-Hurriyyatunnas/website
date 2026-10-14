import type { Media, News } from '@/payload-types'

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
