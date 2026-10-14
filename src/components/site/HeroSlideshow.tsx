'use client'

import { useEffect, useState } from 'react'

export type HeroSlide = { src: string; alt: string; title?: string }

const INTERVAL = 5500

// Satu bingkai lengkung mihrab berisi foto yang berganti pelan (fade + zoom halus).
// Berhenti saat disorot mouse; tidak berganti otomatis untuk pengguna "kurangi animasi".
export function HeroSlideshow({
  slides,
  className = '',
}: {
  slides: HeroSlide[]
  className?: string
}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (slides.length < 2 || paused || reduceMotion) return
    const timer = setTimeout(() => setActive((i) => (i + 1) % slides.length), INTERVAL)
    return () => clearTimeout(timer)
  }, [active, paused, reduceMotion, slides.length])

  if (slides.length === 0) {
    return (
      <div
        className={`stripes relative overflow-hidden rounded-t-full bg-[#e3ddc9] ${className}`}
      />
    )
  }

  const current = slides[active]

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden rounded-t-full bg-[#e3ddc9] shadow-[0_40px_80px_-40px_rgb(11_36_24/0.7)]">
        {slides.map((slide, i) => {
          const isActive = i === active
          const isNext = i === (active + 1) % slides.length
          return (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              aria-hidden={!isActive}
              // Foto aktif & berikutnya dimuat lebih dulu supaya pergantian mulus
              loading={isActive || isNext || i === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] ease-out ${
                isActive ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
              }`}
              style={{
                transitionDuration: reduceMotion
                  ? '0ms'
                  : isActive
                    ? `1400ms, ${INTERVAL + 1800}ms`
                    : '1400ms, 0ms',
              }}
            />
          )
        })}
        <div className="pointer-events-none absolute inset-0 rounded-t-full ring-1 ring-black/5 ring-inset" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b2418]/70 to-transparent" />
      </div>

      {/* Keterangan foto & penanda slide */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
        <p
          key={current.src}
          className="intro max-w-[70%] font-serif text-xl leading-snug font-semibold drop-shadow"
        >
          {current.title ?? current.alt}
        </p>
        {slides.length > 1 && (
          <div className="flex shrink-0 gap-1.5 pb-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Tampilkan foto ${i + 1}: ${slide.title ?? slide.alt}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active ? 'w-6 bg-[#e1bb4c]' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
