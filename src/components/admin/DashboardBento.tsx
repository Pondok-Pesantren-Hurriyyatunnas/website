import type { Payload, ServerProps } from 'payload'
import type { ReactNode } from 'react'

import { hasRole } from '@/access'
import type { News, Registration } from '@/payload-types'
import { Countdown } from '../Countdown'

// Pondok berada di Wajo, Sulawesi Selatan (WITA)
const TIME_ZONE = 'Asia/Makassar'
const DAY_MS = 24 * 60 * 60 * 1000

const dayKey = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date)
const weekdayLabel = (date: Date) => new Intl.DateTimeFormat('id-ID', { weekday: 'short', timeZone: TIME_ZONE }).format(date)
const formatDate = (value: string | Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('id-ID', { ...options, timeZone: TIME_ZONE }).format(new Date(value))
const formatHijri = (date: Date) =>
  `${new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TIME_ZONE })
    .format(date)
    .replace(/\s*(H|AH)$/, '')} H`

const greetingFor = (date: Date) => {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: TIME_ZONE }).format(date))
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

const statusLabels: Record<Registration['status'], string> = {
  new: 'Menunggu',
  verified: 'Diverifikasi',
  accepted: 'Diterima',
  rejected: 'Tidak diterima',
}

const categoryMeta: Record<News['category'], { label: string; color: string; icon: ReactNode }> = {
  activity: { label: 'Kegiatan', color: '#2f9e5f', icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /> },
  announcement: { label: 'Pengumuman', color: '#c9a227', icon: <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" /> },
  achievement: { label: 'Prestasi', color: '#e07a2f', icon: <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /> },
  study: { label: 'Kajian', color: '#165133', icon: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /> },
  article: { label: 'Artikel', color: '#5b6cc9', icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" /> },
}

const avatarColors = ['#d8f3e1', '#fbefc9', '#dbe4fb', '#f9dcd6', '#e6dcf7', '#d5f0f0']
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
const colorFor = (text: string) => avatarColors[[...text].reduce((sum, char) => sum + char.charCodeAt(0), 0) % avatarColors.length]

function Svg({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const ArrowUpRight = () => (
  <Svg size={16}>
    <path d="M7 17 17 7M7 7h10v10" />
  </Svg>
)

type StatCard = { title: string; value: number; href: string; note: ReactNode; hero?: boolean }

function Stat({ stat }: { stat: StatCard }) {
  return (
    <a href={stat.href} className={`ponpes-bento__card ponpes-bento__stat${stat.hero ? ' ponpes-bento__stat--hero' : ''}`}>
      <div className="ponpes-bento__stat-head">
        <span>{stat.title}</span>
        <span className="ponpes-bento__arrow">
          <ArrowUpRight />
        </span>
      </div>
      <div className="ponpes-bento__stat-value">{stat.value.toLocaleString('id-ID')}</div>
      <div className="ponpes-bento__stat-note">{stat.note}</div>
    </a>
  )
}

function TrendChip({ value }: { value: number }) {
  return (
    <span className="ponpes-bento__chip">
      {value}
      <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M5 1 9 8H1z" fill="currentColor" />
      </svg>
    </span>
  )
}

// Grafik batang membulat: pendaftar per hari selama 7 hari terakhir
function WeeklyChart({ days }: { days: { label: string; count: number; isToday: boolean }[] }) {
  const max = Math.max(1, ...days.map((day) => day.count))
  const peak = Math.max(...days.map((day) => day.count))
  return (
    <div className="ponpes-bento__chart" role="img" aria-label={`Pendaftar 7 hari terakhir: ${days.map((day) => `${day.label} ${day.count}`).join(', ')}`}>
      {days.map((day) => {
        const isEmpty = day.count === 0
        const height = isEmpty ? 70 : 28 + (day.count / max) * 60
        const tone = day.count === peak && peak > 0 ? 'dark' : day.isToday ? 'light' : 'mid'
        return (
          <div key={day.label} className="ponpes-bento__bar-col">
            <div className="ponpes-bento__bar-track">
              {day.isToday && !isEmpty && <span className="ponpes-bento__bar-tip">{day.count}</span>}
              <div
                className={`ponpes-bento__bar ${isEmpty ? 'ponpes-bento__bar--empty' : `ponpes-bento__bar--${tone}`}`}
                style={{ height: `${height}%` }}
                title={`${day.label}: ${day.count} pendaftar`}
              />
            </div>
            <span className={`ponpes-bento__bar-label${day.isToday ? ' ponpes-bento__bar-label--today' : ''}`}>{day.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Gauge setengah lingkaran: berapa persen pendaftar yang sudah diproses
function SelectionGauge({ counts }: { counts: Record<Registration['status'], number> }) {
  const total = counts.new + counts.verified + counts.accepted + counts.rejected
  const processed = total - counts.new
  const percent = total ? Math.round((processed / total) * 100) : 0
  const radius = 80
  const length = Math.PI * radius
  const gap = total ? 4 : 0
  const segments = [
    { key: 'accepted', value: counts.accepted, stroke: '#165133' },
    { key: 'verified', value: counts.verified, stroke: '#2f9e5f' },
    { key: 'rejected', value: counts.rejected, stroke: '#e1bb4c' },
    { key: 'new', value: counts.new, stroke: 'url(#ponpes-stripes)' },
  ].filter((segment) => segment.value > 0)

  let offset = 0
  const arcs = segments.map((segment) => {
    const segmentLength = (segment.value / total) * length
    const arc = { ...segment, dash: Math.max(segmentLength - gap, 0.01), offset }
    offset += segmentLength
    return arc
  })

  const path = `M 20 100 A ${radius} ${radius} 0 0 1 180 100`
  return (
    <div className="ponpes-bento__gauge">
      <svg viewBox="0 0 200 112" aria-hidden="true">
        <defs>
          <pattern id="ponpes-stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="var(--theme-elevation-0)" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#9fb3a6" strokeWidth="3" />
          </pattern>
        </defs>
        <path d={path} fill="none" stroke={total ? 'transparent' : 'url(#ponpes-stripes)'} strokeWidth="26" strokeLinecap="round" />
        {arcs.map((arc) => (
          <path
            key={arc.key}
            d={path}
            fill="none"
            stroke={arc.stroke}
            strokeWidth="26"
            strokeLinecap="butt"
            strokeDasharray={`${arc.dash} ${length}`}
            strokeDashoffset={-arc.offset}
          />
        ))}
      </svg>
      <div className="ponpes-bento__gauge-value">
        <strong>{percent}%</strong>
        <span>sudah diproses</span>
      </div>
      <ul className="ponpes-bento__legend">
        <li><i style={{ background: '#165133' }} />Diterima {counts.accepted}</li>
        <li><i style={{ background: '#2f9e5f' }} />Diverifikasi {counts.verified}</li>
        <li><i style={{ background: '#e1bb4c' }} />Tidak diterima {counts.rejected}</li>
        <li><i className="ponpes-bento__legend-stripes" />Menunggu {counts.new}</li>
      </ul>
    </div>
  )
}

async function getAdmissionsData(payload: Payload, academicYear: string, now: Date) {
  const countWhere = (where: Parameters<Payload['count']>[0]['where']) => payload.count({ collection: 'registrations', where }).then((result) => result.totalDocs)
  const inYear = { academicYear: { equals: academicYear } }
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS).toISOString()
  const twoWeeksAgo = new Date(now.getTime() - 14 * DAY_MS).toISOString()

  const [total, statusNew, verified, accepted, rejected, lastWeek, previousWeek, recentDocs, recent] = await Promise.all([
    countWhere(inYear),
    countWhere({ ...inYear, status: { equals: 'new' } }),
    countWhere({ ...inYear, status: { equals: 'verified' } }),
    countWhere({ ...inYear, status: { equals: 'accepted' } }),
    countWhere({ ...inYear, status: { equals: 'rejected' } }),
    countWhere({ createdAt: { greater_than_equal: weekAgo } }),
    countWhere({ and: [{ createdAt: { greater_than_equal: twoWeeksAgo } }, { createdAt: { less_than: weekAgo } }] }),
    payload.find({
      collection: 'registrations',
      where: { createdAt: { greater_than_equal: weekAgo } },
      select: { createdAt: true },
      pagination: false,
      depth: 0,
    }),
    payload.find({ collection: 'registrations', sort: '-createdAt', limit: 4, depth: 0 }),
  ])

  const perDay = new Map<string, number>()
  for (const doc of recentDocs.docs) perDay.set(dayKey(new Date(doc.createdAt)), (perDay.get(dayKey(new Date(doc.createdAt))) ?? 0) + 1)
  const today = dayKey(now)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getTime() - (6 - index) * DAY_MS)
    const key = dayKey(date)
    return { label: weekdayLabel(date), count: perDay.get(key) ?? 0, isToday: key === today }
  })

  return {
    total,
    counts: { new: statusNew, verified, accepted, rejected },
    lastWeek,
    previousWeek,
    days,
    recent: recent.docs,
  }
}

async function getContentData(payload: Payload) {
  const [published, drafts, gallery, media, recentNews] = await Promise.all([
    payload.count({ collection: 'news', where: { _status: { equals: 'published' } } }).then((result) => result.totalDocs),
    payload.count({ collection: 'news', where: { _status: { equals: 'draft' } } }).then((result) => result.totalDocs),
    payload.count({ collection: 'gallery', where: { id: { exists: true } } }).then((result) => result.totalDocs),
    payload.count({ collection: 'media', where: { id: { exists: true } } }).then((result) => result.totalDocs),
    payload.find({ collection: 'news', sort: '-updatedAt', limit: 5, depth: 0, draft: true }),
  ])
  return { published, drafts, gallery, media, recentNews: recentNews.docs }
}

// Dashboard bento: menggantikan isi atas halaman dashboard admin (layout terinspirasi "Donezo")
export async function DashboardBento({ payload, user }: ServerProps) {
  if (!user) return null

  const req = { user } as never
  const canSeeAdmissions = hasRole(req, 'admin', 'admissions')
  const canSeeContent = hasRole(req, 'admin', 'editor')
  const admin = payload.config.routes.admin
  const now = new Date()
  const firstName = (user as { name?: string }).name?.split(' ')[0] || 'Admin'

  const admissions = await payload.findGlobal({ slug: 'admissions', depth: 0 })
  const [psb, content] = await Promise.all([
    canSeeAdmissions ? getAdmissionsData(payload, admissions.academicYear, now) : null,
    canSeeContent ? getContentData(payload) : null,
  ])

  const stats: StatCard[] = psb
    ? [
        {
          title: 'Total Pendaftar',
          value: psb.total,
          href: `${admin}/collections/registrations`,
          hero: true,
          note: (
            <>
              <TrendChip value={psb.lastWeek} /> pendaftar baru 7 hari terakhir
            </>
          ),
        },
        {
          title: 'Diterima',
          value: psb.counts.accepted,
          href: `${admin}/collections/registrations?where[status][equals]=accepted`,
          note: `Tahun ajaran ${admissions.academicYear}`,
        },
        {
          title: 'Diverifikasi',
          value: psb.counts.verified,
          href: `${admin}/collections/registrations?where[status][equals]=verified`,
          note: 'Berkas sudah dicek',
        },
        {
          title: 'Menunggu',
          value: psb.counts.new,
          href: `${admin}/collections/registrations?where[status][equals]=new`,
          note: psb.counts.new > 0 ? <span className="ponpes-bento__attention">Perlu ditinjau</span> : 'Semua sudah diproses',
        },
      ]
    : content
      ? [
          { title: 'Berita Terbit', value: content.published, href: `${admin}/collections/news`, hero: true, note: 'Tampil di website' },
          { title: 'Draft Berita', value: content.drafts, href: `${admin}/collections/news`, note: 'Belum diterbitkan' },
          { title: 'Foto Galeri', value: content.gallery, href: `${admin}/collections/gallery`, note: 'Di halaman Galeri' },
          { title: 'File Media', value: content.media, href: `${admin}/collections/media`, note: 'Gambar tersimpan' },
        ]
      : []

  const weekDiff = psb ? psb.lastWeek - psb.previousWeek : 0

  return (
    <section className="ponpes-bento" aria-label="Ringkasan dashboard">
      <header className="ponpes-bento__header">
        <div>
          <p className="ponpes-bento__bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <h1 className="ponpes-bento__title">
            {greetingFor(now)}, {firstName}
          </h1>
          <p className="ponpes-bento__subtitle">
            {formatDate(now, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {formatHijri(now)}
          </p>
        </div>
        <div className="ponpes-bento__header-actions">
          {canSeeContent && (
            <a className="ponpes-bento__btn ponpes-bento__btn--primary" href={`${admin}/collections/news/create`}>
              <Svg size={16}>
                <path d="M12 5v14M5 12h14" />
              </Svg>
              Tulis Berita
            </a>
          )}
          {canSeeAdmissions && (
            <a className="ponpes-bento__btn" href={`${admin}/collections/registrations`}>
              Data Pendaftar
            </a>
          )}
        </div>
      </header>

      <div className="ponpes-bento__grid">
        {stats.map((stat) => (
          <div key={stat.title} className="ponpes-bento__cell ponpes-bento__cell--stat">
            <Stat stat={stat} />
          </div>
        ))}

        {psb && (
          <div className="ponpes-bento__cell ponpes-bento__cell--chart">
            <div className="ponpes-bento__card">
              <div className="ponpes-bento__card-head">
                <h2>Pendaftar 7 Hari Terakhir</h2>
                <span className="ponpes-bento__muted">
                  {weekDiff === 0 ? 'Sama dengan minggu lalu' : `${weekDiff > 0 ? '+' : ''}${weekDiff} dari minggu lalu`}
                </span>
              </div>
              <WeeklyChart days={psb.days} />
            </div>
          </div>
        )}

        {psb && (
          <div className="ponpes-bento__cell ponpes-bento__cell--psb">
            <div className="ponpes-bento__card ponpes-bento__psb">
              <h2>Status PSB</h2>
              <p className={`ponpes-bento__psb-status${admissions.isOpen ? '' : ' ponpes-bento__psb-status--closed'}`}>
                {admissions.isOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
              </p>
              <p className="ponpes-bento__muted">
                Tahun ajaran {admissions.academicYear}
                {admissions.closesAt && (
                  <>
                    <br />
                    Ditutup {formatDate(admissions.closesAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA
                  </>
                )}
              </p>
              <a className="ponpes-bento__btn ponpes-bento__btn--primary ponpes-bento__btn--block" href={`${admin}/globals/admissions`}>
                <Svg size={16}>
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </Svg>
                Atur Info PSB
              </a>
            </div>
          </div>
        )}

        {content && (
          <div className={`ponpes-bento__cell ${psb ? 'ponpes-bento__cell--news' : 'ponpes-bento__cell--news-wide'}`}>
            <div className="ponpes-bento__card">
              <div className="ponpes-bento__card-head">
                <h2>Berita Terbaru</h2>
                <a className="ponpes-bento__pill" href={`${admin}/collections/news/create`}>
                  + Baru
                </a>
              </div>
              {content.recentNews.length > 0 ? (
                <ul className="ponpes-bento__list">
                  {content.recentNews.map((post) => {
                    const meta = categoryMeta[post.category]
                    return (
                      <li key={post.id}>
                        <a href={`${admin}/collections/news/${post.id}`} className="ponpes-bento__row">
                          <span className="ponpes-bento__icon-badge" style={{ color: meta.color, background: `${meta.color}1a` }}>
                            <Svg size={16}>{meta.icon}</Svg>
                          </span>
                          <span className="ponpes-bento__row-text">
                            <span className="ponpes-bento__row-title">{post.title}</span>
                            <span className="ponpes-bento__row-meta">
                              {post._status === 'published' ? 'Terbit' : 'Draft'} · {formatDate(post.updatedAt, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="ponpes-bento__empty">Belum ada berita.</p>
              )}
            </div>
          </div>
        )}

        {psb && (
          <div className="ponpes-bento__cell ponpes-bento__cell--recent">
            <div className="ponpes-bento__card">
              <div className="ponpes-bento__card-head">
                <h2>Pendaftar Terbaru</h2>
                <a className="ponpes-bento__pill" href={`${admin}/collections/registrations`}>
                  Lihat semua
                </a>
              </div>
              {psb.recent.length > 0 ? (
                <ul className="ponpes-bento__list">
                  {psb.recent.map((registration) => (
                    <li key={registration.id}>
                      <a href={`${admin}/collections/registrations/${registration.id}`} className="ponpes-bento__row">
                        <span className="ponpes-bento__avatar" style={{ background: colorFor(registration.fullName) }}>
                          {initials(registration.fullName)}
                        </span>
                        <span className="ponpes-bento__row-text">
                          <span className="ponpes-bento__row-title">{registration.fullName}</span>
                          <span className="ponpes-bento__row-meta">
                            Mendaftar ke <b>{registration.level}</b> · {formatDate(registration.createdAt, { day: 'numeric', month: 'short' })}
                          </span>
                        </span>
                        <span className={`ponpes-bento__badge ponpes-bento__badge--${registration.status}`}>{statusLabels[registration.status]}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ponpes-bento__empty">Belum ada pendaftar.</p>
              )}
            </div>
          </div>
        )}

        {psb && (
          <div className="ponpes-bento__cell ponpes-bento__cell--gauge">
            <div className="ponpes-bento__card">
              <div className="ponpes-bento__card-head">
                <h2>Progres Seleksi</h2>
              </div>
              <SelectionGauge counts={psb.counts} />
            </div>
          </div>
        )}

        {psb && (
          <div className="ponpes-bento__cell ponpes-bento__cell--countdown">
            <div className="ponpes-bento__card ponpes-bento__countdown">
              <h2>Penutupan Pendaftaran</h2>
              {admissions.closesAt ? (
                <>
                  <Countdown
                    target={admissions.closesAt}
                    className="ponpes-bento__countdown-time"
                    daysClassName="ponpes-bento__countdown-days"
                    doneClassName="ponpes-bento__countdown-done"
                  />
                  <p>{formatDate(admissions.closesAt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </>
              ) : (
                <>
                  <div className="ponpes-bento__countdown-time">--:--:--</div>
                  <a href={`${admin}/globals/admissions`}>Atur tanggal penutupan →</a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
