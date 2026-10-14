'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

// Saat website dibuka di panel Live Preview dashboard, muat ulang data setiap kali admin menyimpan
export function LivePreviewListener() {
  const router = useRouter()
  if (typeof window === 'undefined') return null
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={window.location.origin} />
}
