import { ImageResponse } from 'next/og'

import { getAdmissions, getSiteSettings } from '@/lib/payload'

// Gambar preview saat link website dibagikan (WhatsApp, Facebook, dll.)
export const alt = 'Pondok Pesantren Hurriyyatunnas Bakti Awo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const [site, admissions] = await Promise.all([getSiteSettings(), getAdmissions()])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #082316 0%, #165133 100%)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <svg width="96" height="96" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="23" fill="#165133" stroke="#c9a227" strokeWidth="2" />
            <path d="M27 11a13 13 0 1 0 10 21.5A11 11 0 1 1 27 11z" fill="#c9a227" />
            <path d="M33 14l1.3 3 3.2.3-2.4 2.1.7 3.1-2.8-1.6-2.8 1.6.7-3.1-2.4-2.1 3.2-.3z" fill="#ecd27f" />
          </svg>
          <div style={{ fontSize: 32, color: '#e1bb4c' }}>Pondok Pesantren</div>
        </div>
        <div style={{ marginTop: 32, fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>Hurriyyatunnas Bakti Awo</div>
        {site.tagline && <div style={{ marginTop: 28, fontSize: 32, color: '#d8f3e1', maxWidth: 900 }}>{site.tagline}</div>}
        {admissions.isOpen && (
          <div style={{ marginTop: 48, fontSize: 28, color: '#e1bb4c' }}>
            {`Pendaftaran santri baru ${admissions.academicYear} dibuka online`}
          </div>
        )}
      </div>
    ),
    size,
  )
}
