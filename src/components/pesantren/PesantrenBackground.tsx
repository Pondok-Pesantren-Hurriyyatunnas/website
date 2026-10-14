'use client'

import { useEffect, useRef, useState } from 'react'

import type { SceneHandle } from './scene'

// Latar animasi 3D lingkungan pesantren.
// Scene dimuat terpisah (dynamic import) setelah halaman tampil, dan otomatis berhenti
// saat tidak terlihat. Jika WebGL tidak tersedia, latar di belakangnya tetap tampil.
// `fullPage`: latar layar penuh di belakang seluruh beranda; kamera ikut posisi gulir.
export function PesantrenBackground({ fullPage = false }: { fullPage?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let handle: SceneHandle | null = null
    let disposed = false
    let visible = true
    const cleanups: (() => void)[] = []

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const smallScreen = window.matchMedia('(max-width: 768px)').matches
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
      true
    // ?jam=19 untuk melihat suasana pada jam tertentu (berguna saat demo)
    const jamParam = new URLSearchParams(window.location.search).get('jam')
    const jam = jamParam === null ? NaN : Number(jamParam)
    const hourOverride = jam >= 0 && jam < 24 ? jam : null

    import('./scene').then(({ createPesantrenScene }) => {
      if (disposed) return
      handle = createPesantrenScene(canvas, {
        hourOverride,
        lowPower: smallScreen || lowCpu || saveData,
        staticFrame: reducedMotion,
        maxPixelRatio: fullPage ? 1.25 : 1.5,
      })
      if (!handle) return
      setReady(true)

      const syncRunning = () => {
        if (visible && document.visibilityState === 'visible') handle?.start()
        else handle?.stop()
      }

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        syncRunning()
      })
      observer.observe(canvas)
      cleanups.push(() => observer.disconnect())

      const resizeObserver = new ResizeObserver(() => handle?.resize())
      if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
      cleanups.push(() => resizeObserver.disconnect())

      document.addEventListener('visibilitychange', syncRunning)
      cleanups.push(() => document.removeEventListener('visibilitychange', syncRunning))

      // Kamera sedikit mengikuti mouse (desktop)
      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        handle?.setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * 2 - 1,
        )
      }
      window.addEventListener('pointermove', onPointer, { passive: true })
      cleanups.push(() => window.removeEventListener('pointermove', onPointer))

      if (fullPage) {
        const onScroll = () => {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight
          handle?.setScroll(scrollable > 0 ? window.scrollY / scrollable : 0)
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        cleanups.push(() => window.removeEventListener('scroll', onScroll))
      }

      syncRunning()
    })

    return () => {
      disposed = true
      cleanups.forEach((cleanup) => cleanup())
      handle?.dispose()
    }
  }, [fullPage])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
