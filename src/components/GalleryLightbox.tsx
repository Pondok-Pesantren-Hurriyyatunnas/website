'use client'

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react'

export type GalleryPhoto = {
  id: string
  title: string
  caption?: string | null
  thumb?: string
  full?: string
  date: string
}

// Jarak geser minimal (px) supaya dianggap swipe, bukan tap
const SWIPE_THRESHOLD = 50

export function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)

  const isOpen = index !== null
  const total = photos.length
  const close = useCallback(() => setIndex(null), [])
  const show = useCallback((next: number) => setIndex(((next % total) + total) % total), [total])
  const prev = useCallback(() => index !== null && show(index - 1), [index, show])
  const next = useCallback(() => index !== null && show(index + 1), [index, show])

  // Keyboard, kunci scroll halaman, dan kembalikan fokus ke foto yang diklik saat ditutup
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') prev()
      if (event.key === 'ArrowRight') next()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeButton.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close, prev, next])

  useEffect(() => {
    if (!isOpen) lastTrigger.current?.focus()
  }, [isOpen])

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) (deltaX > 0 ? prev : next)()
    touchStartX.current = null
  }

  const current = index !== null ? photos[index] : null
  // Muat foto sebelum & sesudahnya lebih dulu supaya perpindahan terasa instan
  const neighbors =
    index !== null && total > 1
      ? [photos[(index + 1) % total], photos[(index - 1 + total) % total]]
      : []

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
        {photos.map((photo, i) => (
          <figure key={photo.id} className="card-bento group p-2">
            <button
              type="button"
              onClick={(event) => {
                lastTrigger.current = event.currentTarget
                setIndex(i)
              }}
              className="relative block w-full overflow-hidden rounded-[20px] focus-visible:ring-4 focus-visible:ring-gold-400 focus-visible:outline-none"
              aria-label={`Lihat foto: ${photo.title}`}
            >
              <img
                src={photo.thumb}
                alt={photo.title}
                loading="lazy"
                className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-brand-950/0 transition group-hover:bg-brand-950/30">
                <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-brand-900 opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </span>
            </button>
            <figcaption className="px-2 pt-3 pb-1">
              <div className="text-sm font-semibold text-brand-900">{photo.title}</div>
              {photo.caption && <div className="text-xs text-slate-500">{photo.caption}</div>}
            </figcaption>
          </figure>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${index! + 1} dari ${total}: ${current.title}`}
          className="fixed inset-0 z-[60] flex flex-col bg-brand-950/95 text-white backdrop-blur-sm"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Baris atas: penghitung & tombol tutup */}
          <div
            className="flex items-center justify-between px-4 py-3 sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold tabular-nums">
              {index! + 1} / {total}
            </span>
            <button
              ref={closeButton}
              type="button"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none"
              aria-label="Tutup"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Foto */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
            <img
              key={current.id}
              src={current.full}
              alt={current.title}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    prev()
                  }}
                  className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none sm:left-5"
                  aria-label="Foto sebelumnya"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    next()
                  }}
                  className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:outline-none sm:right-5"
                  aria-label="Foto berikutnya"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Keterangan */}
          <div
            className="px-4 pt-3 pb-6 text-center sm:px-6"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-semibold">{current.title}</p>
            {current.caption && <p className="mt-1 text-sm text-brand-100/70">{current.caption}</p>}
            <p className="mt-1 text-xs text-brand-100/50">{current.date}</p>
          </div>

          {neighbors.map((photo) => (
            <link key={photo.id} rel="preload" as="image" href={photo.full} />
          ))}
        </div>
      )}
    </>
  )
}
