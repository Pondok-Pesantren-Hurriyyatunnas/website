import type { Metadata } from 'next'
import { Amiri, Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import '../(frontend)/globals.css'
import './pratinjau.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const amiri = Amiri({ subsets: ['arabic'], weight: '700', variable: '--font-amiri' })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

// Halaman pratinjau konsep desain: tidak untuk diindeks mesin pencari
export const metadata: Metadata = {
  title: 'Pratinjau Konsep | Pondok Pesantren Hurriyyatunnas Bakti Awo',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
}

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${amiri.variable} ${cormorant.variable}`}>
      <body className="bg-[#04110b] font-sans text-[#f4efe1] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
