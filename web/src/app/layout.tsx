import type { Metadata } from 'next'

import { SiteFooter } from '@/components/site-footer.component'
import { SiteHeader } from '@/components/site-header.component'

import './globals.css'

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
      <body className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
