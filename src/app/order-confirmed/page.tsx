'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

function OrderConfirmedContent() {
  const params = useSearchParams()
  const orderId = params.get('orderId') || ''
  const table = params.get('table') || ''

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-8">
      <Logo size="lg" className="mb-8" />

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Your order has been sent to the venue</p>

        <div className="bg-orange-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-orange-600 font-medium">Table</p>
          <p className="text-3xl font-black text-orange-700">{table}</p>
        </div>

        {orderId && (
          <div className="text-sm text-gray-400 mb-6">
            Order #{orderId.slice(0, 8).toUpperCase()}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-6">
          Sit back and relax — your order is on its way!
        </p>

        <Link
          href="/"
          className="block w-full bg-orange-600 text-white py-3 rounded-2xl font-semibold active:scale-95 transition-transform"
        >
          Done
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <OrderConfirmedContent />
    </Suspense>
  )
}
