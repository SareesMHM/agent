// @ts-expect-error Next.js handles global CSS imports at build time.
import './globals.css';

import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}