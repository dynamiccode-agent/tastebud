import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/store/cart'

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
    <html lang="en">
      <body>
        <CartProvider>
          <div className="min-h-screen max-w-md mx-auto bg-white">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
