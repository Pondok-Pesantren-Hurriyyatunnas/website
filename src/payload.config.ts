import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { id } from '@payloadcms/translations/languages/id'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { adminTranslations } from './admin-translations'
import { Gallery } from './collections/Gallery'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Registrations } from './collections/Registrations'
import { Users } from './collections/Users'
import { Admissions } from './globals/Admissions'
import { HomePage } from './globals/HomePage'
import { ProfilePage } from './globals/ProfilePage'
import { ProgramPage } from './globals/ProgramPage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Tanpa S3_BUCKET (mis. saat development), file disimpan di folder lokal /media
const useS3 = Boolean(process.env.S3_BUCKET)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''

// Alamat yang boleh memakai cookie login dashboard (perlindungan CSRF Payload).
// Selain serverURL, alamat Vercel (per-deploy, per-branch, production) ikut diizinkan otomatis,
// supaya dashboard tetap bisa menyimpan walaupun dibuka lewat URL Vercel mana pun.
const trustedOrigins = [
  serverURL,
  ...[
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]
    .filter(Boolean)
    .map((host) => `https://${host}`),
].filter(Boolean)

export default buildConfig({
  serverURL,
  csrf: trustedOrigins,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' | Admin PP Hurriyyatunnas',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    dateFormat: 'd MMMM yyyy, HH:mm',
    // Tampilan dashboard bertema pondok (gaya ada di src/app/(payload)/custom.scss)
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo#AdminLogo',
        Icon: '@/components/admin/AdminIcon#AdminIcon',
      },
      beforeDashboard: ['@/components/admin/DashboardBento#DashboardBento'],
      beforeNavLinks: ['@/components/admin/NavBrand#NavBrand'],
      afterNavLinks: ['@/components/admin/ViewSiteLink#ViewSiteLink'],
    },
  },
  // Dashboard selalu berbahasa Indonesia, apa pun bahasa browser admin
  i18n: {
    supportedLanguages: { id },
    fallbackLanguage: 'id',
    translations: adminTranslations,
  },
  collections: [News, Gallery, Media, Registrations, Users],
  globals: [HomePage, ProfilePage, ProgramPage, SiteSettings, Admissions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.DATABASE_URL || '' }),
  sharp,
  plugins: [
    s3Storage({
      enabled: useS3,
      bucket: process.env.S3_BUCKET || '',
      acl: 'public-read',
      // Upload langsung dari browser ke S3, supaya tidak kena batas 4.5MB Vercel (bucket perlu CORS)
      clientUploads: true,
      collections: {
        // Folder dipisah per database (dev: media-dev, production: media) supaya file tidak saling menimpa/terhapus
        media: { prefix: process.env.S3_PREFIX || 'media', disablePayloadAccessControl: true },
      },
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'us-east-1',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
    importExportPlugin({
      collections: [
        {
          slug: 'registrations',
          export: { format: 'csv', disableJobsQueue: true, disableSave: true },
          import: false,
        },
      ],
    }),
  ],
})
