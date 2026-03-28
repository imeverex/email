import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Send Mail',
  description: 'Send emails from your custom domain',
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
