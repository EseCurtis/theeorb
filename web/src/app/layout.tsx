import type { Metadata } from 'next'
import { Pixelify_Sans } from 'next/font/google'

import { SiteFooter } from '@/components/site-footer.component'
import { SiteHeader } from '@/components/site-header.component'

import './globals.css'

const pixelifySans = Pixelify_Sans({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-pixel',
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
      <body className={`${pixelifySans.variable} min-h-screen bg-background text-foreground`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
