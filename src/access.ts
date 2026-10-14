import type { Access, FieldAccess, PayloadRequest } from 'payload'

// Peran admin:
// - admin      : akses penuh (termasuk kelola akun admin)
// - editor     : kelola konten website (berita, galeri, halaman, pengaturan)
// - admissions : panitia PSB, hanya kelola data pendaftar
export type Role = 'admin' | 'editor' | 'admissions'

export const hasRole = (req: Pick<PayloadRequest, 'user'>, ...roles: Role[]) => {
  const role = (req.user as { role?: Role } | null)?.role
  return Boolean(role && roles.includes(role))
}

export const anyone: Access = () => true
export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')
export const canEditContent: Access = ({ req }) => hasRole(req, 'admin', 'editor')
export const canManageAdmissions: Access = ({ req }) => hasRole(req, 'admin', 'admissions')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req, 'admin')

// Publik hanya bisa membaca dokumen yang sudah terbit; editor bisa membaca draft
export const publishedOrEditor: Access = ({ req }) => {
  if (hasRole(req, 'admin', 'editor')) return true
  return { _status: { equals: 'published' } }
}

// Admin bisa mengelola semua akun; pengguna lain hanya akunnya sendiri
export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req, 'admin')) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}
