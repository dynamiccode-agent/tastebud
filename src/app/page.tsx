import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-orange-50">
      <Logo size="xl" className="mb-4" />
      <p className="text-gray-500 text-center mb-8">Scan your table QR code to order</p>
      <Link
        href="/venue/11111111-1111-1111-1111-111111111111/table/1"
        className="bg-orange-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg active:scale-95 transition-transform"
      >
        Try Demo (Table 1)
      </Link>
    </div>
  )
}
