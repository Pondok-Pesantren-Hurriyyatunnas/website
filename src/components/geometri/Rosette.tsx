import type { CSSProperties } from 'react'

// Ornamen bintang islami (girih) yang dihitung secara geometris.
// Setiap garis digambar bertahap lewat CSS (stroke-dashoffset), lalu satu lapisan kilau
// menyapu garis emasnya. Lihat kelas .rosette-* di pratinjau.css.

type Ring =
  | { kind: 'star'; n: number; k: number; r: number; rot?: number; width: number }
  | { kind: 'circle'; r: number; width: number; dashed?: boolean }
  | {
      kind: 'satellites'
      count: number
      orbit: number
      n: number
      k: number
      r: number
      rot?: number
      width: number
    }

// Rosette islami klasik: tiap lapisan berada di "pita"-nya sendiri sehingga garis tidak
// saling menembus. Bintang {n/k} dengan k kecil membentuk pita bergerigi yang rapi.
const RINGS: Ring[] = [
  { kind: 'star', n: 8, k: 2, r: 40, width: 1.4 }, // Rub el Hizb: dua persegi bersilang
  { kind: 'star', n: 8, k: 3, r: 54, rot: Math.PI / 8, width: 1.1 },
  { kind: 'circle', r: 64, width: 0.7 },
  { kind: 'satellites', count: 8, orbit: 102, n: 8, k: 3, r: 22, width: 0.9 }, // kelopak
  { kind: 'circle', r: 134, width: 0.6 },
  { kind: 'star', n: 16, k: 3, r: 186, width: 0.9 }, // pita bergerigi
  { kind: 'circle', r: 196, width: 0.6 },
  { kind: 'satellites', count: 16, orbit: 226, n: 8, k: 2, r: 13, rot: Math.PI / 16, width: 0.7 },
  { kind: 'circle', r: 252, width: 0.5, dashed: true },
  { kind: 'circle', r: 264, width: 0.5 },
  { kind: 'star', n: 32, k: 5, r: 322, rot: Math.PI / 32, width: 0.55 }, // pita luar halus
  { kind: 'circle', r: 334, width: 0.5 },
  { kind: 'circle', r: 352, width: 0.35, dashed: true },
]

const point = (r: number, angle: number) =>
  `${(r * Math.cos(angle)).toFixed(2)} ${(r * Math.sin(angle)).toFixed(2)}`

/** Poligon bintang {n/k}; jika n dan k tidak koprima, terbentuk beberapa poligon terpisah. */
function starPaths(n: number, k: number, r: number, rot = 0): string[] {
  const visited = new Set<number>()
  const paths: string[] = []
  const start = -Math.PI / 2 + rot
  for (let first = 0; first < n; first++) {
    if (visited.has(first)) continue
    let i = first
    let d = ''
    do {
      visited.add(i)
      d += `${d ? 'L' : 'M'}${point(r, start + (i * 2 * Math.PI) / n)} `
      i = (i + k) % n
    } while (i !== first)
    paths.push(`${d}Z`)
  }
  return paths
}

const circlePath = (r: number) => `M${-r} 0 A${r} ${r} 0 1 0 ${r} 0 A${r} ${r} 0 1 0 ${-r} 0`

function ringPaths(ring: Ring): string[] {
  if (ring.kind === 'star') return starPaths(ring.n, ring.k, ring.r, ring.rot)
  if (ring.kind === 'circle') return [circlePath(ring.r)]
  // Bintang-bintang kecil yang mengelilingi pusat pada satu orbit
  return Array.from({ length: ring.count }, (_, i) => {
    const angle = -Math.PI / 2 + (ring.rot ?? 0) + (i * 2 * Math.PI) / ring.count
    const cx = ring.orbit * Math.cos(angle)
    const cy = ring.orbit * Math.sin(angle)
    return starPaths(ring.n, ring.k, ring.r, angle + Math.PI / 2)
      .map((d) =>
        d.replace(
          /(-?\d+\.?\d*) (-?\d+\.?\d*)/g,
          (_m, x, y) => `${(Number(x) + cx).toFixed(2)} ${(Number(y) + cy).toFixed(2)}`,
        ),
      )
      .join(' ')
  })
}

function Lines({ variant }: { variant: 'base' | 'shine' }) {
  return (
    <>
      {RINGS.map((ring, ringIndex) =>
        ringPaths(ring).map((d, pathIndex) => (
          <path
            key={`${ringIndex}-${pathIndex}`}
            d={d}
            pathLength={1}
            fill="none"
            strokeWidth={ring.width}
            strokeDasharray={ring.kind === 'circle' && ring.dashed ? '0.004 0.008' : undefined}
            className={
              variant === 'base'
                ? ring.kind === 'circle' && ring.dashed
                  ? 'rosette-fade'
                  : 'rosette-line'
                : undefined
            }
            // Lingkaran dalam tergambar lebih dulu, lalu menjalar keluar
            style={
              variant === 'base'
                ? ({ '--delay': `${0.5 + ringIndex * 0.16 + pathIndex * 0.03}s` } as CSSProperties)
                : undefined
            }
          />
        )),
      )}
    </>
  )
}

export function Rosette({ className }: { className?: string }) {
  return (
    <svg viewBox="-380 -380 760 760" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id="rosette-gold"
          x1="-380"
          y1="-380"
          x2="380"
          y2="380"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f6e4a6" />
          <stop offset="0.45" stopColor="#d4ac3a" />
          <stop offset="1" stopColor="#8f6f1a" />
        </linearGradient>
        <radialGradient id="rosette-core" r="0.5">
          <stop offset="0" stopColor="#f6e4a6" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f6e4a6" stopOpacity="0" />
        </radialGradient>
        {/* Pita cahaya yang menyapu ornamen */}
        <linearGradient id="rosette-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="rosette-shine-mask">
          <rect
            className="rosette-sweep"
            x="-380"
            y="-380"
            width="260"
            height="760"
            fill="url(#rosette-sweep)"
          />
        </mask>
      </defs>

      <circle r="120" fill="url(#rosette-core)" className="rosette-core" />
      <g className="rosette-spin">
        <g stroke="url(#rosette-gold)">
          <Lines variant="base" />
        </g>
        <g stroke="#fff7d6" mask="url(#rosette-shine-mask)" className="rosette-shine">
          <Lines variant="shine" />
        </g>
      </g>
    </svg>
  )
}
