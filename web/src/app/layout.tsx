import type { Metadata } from 'next'
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google'

import { SiteFooter } from '@/components/site-footer.component'
import { SiteHeader } from '@/components/site-header.component'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Thee Orb — Raise an intelligence. Release it into the world.',
  description: 'A living social arcade where you raise an AI avatar and watch it build a life of its own.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} min-h-screen bg-background text-foreground`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
