'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, Star } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

function OrderConfirmedContent() {
  const params = useSearchParams()
  const orderId = params.get('orderId') || ''
  const table = params.get('table') || ''
  const pointsEarned = parseInt(params.get('pointsEarned') || '0')
  const newBalance = params.get('newBalance') ? parseInt(params.get('newBalance')!) : null

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#fffdf0' }}>
      <Logo size="lg" className="mb-8" />

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F9BA0B' }}>
            <CheckCircle className="w-10 h-10 text-black" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Order placed!</h1>
        <p className="text-gray-500 mb-6">Your order is on its way to the kitchen</p>

        <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#fffdf0', border: '1.5px solid #F9BA0B' }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Your table</p>
          <p className="text-3xl font-black text-gray-900">{table}</p>
        </div>

        {pointsEarned > 0 && (
          <div className="rounded-2xl p-4 mb-4 flex items-center gap-3 text-left" style={{ backgroundColor: '#fffdf0', border: '1.5px solid #F9BA0B' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F9BA0B' }}>
              <Star className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">+{pointsEarned} points earned</p>
              {newBalance !== null && (
                <p className="text-xs text-gray-500">Balance: {newBalance.toLocaleString()} points</p>
              )}
            </div>
          </div>
        )}

        {orderId && (
          <div className="text-sm text-gray-400 mb-6">
            Order #{orderId.slice(0, 8).toUpperCase()}
          </div>
        )}

        <p className="text-sm text-gray-400 mb-6">
          Sit back and relax. Your food is being prepared.
        </p>

        <Link
          href="/"
          className="block w-full py-3 rounded-2xl font-semibold active:scale-95 transition-transform text-black"
          style={{ backgroundColor: '#F9BA0B' }}
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
