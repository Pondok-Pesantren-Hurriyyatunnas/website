export const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

// Website hanya boleh diindeks Google kalau ALLOW_INDEXING=true (diatur di Vercel saat go-live).
// Default-nya tidak, supaya website preview / data contoh tidak muncul di Google.
export const allowIndexing = process.env.ALLOW_INDEXING === 'true'

export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
