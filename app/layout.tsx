import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteThemeProvider } from '@/components/ui/SiteThemeProvider'
import PageIntro from '@/components/ui/PageIntro'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Streaming Spartan — Entretenimiento Premium',
  description: 'Tu mejor opción para acceder a Netflix, Disney+, Prime Video, HBO Max y Spotify al mejor precio.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ backgroundColor: '#050505', color: '#fff', overflowX: 'hidden' }}>
        <PageIntro />
        <SiteThemeProvider>
          {children}
        </SiteThemeProvider>
      </body>
    </html>
  )
}
