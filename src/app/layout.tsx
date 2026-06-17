import type { Metadata, Viewport } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/store/cart'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'TasteBud — Order at your table',
  description: 'Scan, order, enjoy. No waiting.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <CartProvider>
          <div className="min-h-dvh max-w-md mx-auto bg-white">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
