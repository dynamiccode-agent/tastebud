'use client'
import { useCart } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, subtotal, venueId, tableNumber, itemCount } = useCart()
  const router = useRouter()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <ShoppingBag className="w-20 h-20 text-orange-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Add some items to get started</p>
        <button
          onClick={() => router.back()}
          className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold"
        >
          Browse Menu
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-4 flex items-center gap-3 shadow-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Logo size="xs" />
        <span className="text-gray-400 text-sm ml-auto">Table {tableNumber}</span>
      </div>

      <div className="px-4 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Order</h1>

        <div className="space-y-3">
          {items.map(item => {
            const extrasTotal = item.customisations.added.reduce((s, a) => s + a.price, 0)
            const itemTotal = (item.price + extrasTotal) * item.quantity
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="font-bold text-orange-600">{formatPrice(itemTotal)}</span>
                </div>

                {item.customisations.removed.length > 0 && (
                  <p className="text-xs text-red-500 mb-1">
                    No: {item.customisations.removed.join(', ')}
                  </p>
                )}
                {item.customisations.added.length > 0 && (
                  <p className="text-xs text-green-600 mb-1">
                    + {item.customisations.added.map(a => a.name).join(', ')}
                  </p>
                )}
                {item.notes && (
                  <p className="text-xs text-gray-400 italic mb-2">"{item.notes}"</p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-orange-600">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 safe-bottom z-30">
        <button
          onClick={() => router.push('/checkout')}
          className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl active:scale-95 transition-transform"
        >
          Checkout — {formatPrice(total)}
        </button>
      </div>
    </div>
  )
}
