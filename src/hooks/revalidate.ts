import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

// Setiap konten berubah, seluruh halaman website dibangun ulang saat dikunjungi berikutnya.
// Dibungkus try/catch karena hook juga bisa jalan di luar Next.js (mis. saat `npm run seed`).
const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // di luar konteks Next.js, tidak perlu revalidate
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateSite()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidateSite()
  return doc
}
