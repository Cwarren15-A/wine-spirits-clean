import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wine & Spirits Marketplace',
  description: 'A compliant wine and spirits trading platform',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
