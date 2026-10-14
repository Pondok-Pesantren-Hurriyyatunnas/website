'use client'

import { useEffect } from 'react'

// Efek kecil di sisi browser untuk halaman bergaya "Geometri Cahaya":
// - ornamen sedikit mengikuti mouse (variabel CSS --mx / --my di <html>)
// - elemen [data-reveal] muncul halus saat masuk ke layar
export function MotionLayer() {
  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            reveal.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element))

    let frame = 0
    const onPointer = (event: PointerEvent) => {
      if (reduceMotion || event.pointerType !== 'mouse') return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--mx', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        root.style.setProperty('--my', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      reveal.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return null
}
