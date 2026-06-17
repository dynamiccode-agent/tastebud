'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { X, Minus, Plus, UtensilsCrossed } from 'lucide-react'

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
  isAlcohol: boolean | null
  categoryId: string
  customisationOptions: {
    removeOptions?: string[]
    addExtras?: { name: string; price: number }[]
  } | null
}

interface Props {
  item: MenuItem
  onClose: () => void
}

export function ItemModal({ item, onClose }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [removed, setRemoved] = useState<string[]>([])
  const [added, setAdded] = useState<{ name: string; price: number }[]>([])
  const [notes, setNotes] = useState('')

  const basePrice = parseFloat(item.price)
  const extrasTotal = added.reduce((s, a) => s + a.price, 0)
  const lineTotal = (basePrice + extrasTotal) * quantity

  function toggleRemove(opt: string) {
    setRemoved(prev => prev.includes(opt) ? prev.filter(r => r !== opt) : [...prev, opt])
  }

  function toggleExtra(extra: { name: string; price: number }) {
    setAdded(prev => {
      const exists = prev.find(a => a.name === extra.name)
      return exists ? prev.filter(a => a.name !== extra.name) : [...prev, extra]
    })
  }

  function handleAdd() {
    addItem({
      id: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: basePrice,
      quantity,
      image: item.image || undefined,
      isAlcohol: item.isAlcohol || false,
      customisations: { removed, added },
      notes,
    })
    onClose()
  }

  const opts = item.customisationOptions

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Image */}
        <div className="aspect-video bg-orange-50 flex items-center justify-center flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <UtensilsCrossed className="w-16 h-16 text-orange-200" />
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 flex-1 pr-4">{item.name}</h2>
            <span className="text-xl font-bold text-orange-600">{formatPrice(item.price)}</span>
          </div>
          {item.description && (
            <p className="text-gray-500 text-sm mb-5">{item.description}</p>
          )}
          {item.isAlcohol && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5 text-sm text-orange-800">
              🔞 This is an alcoholic beverage. Must be 18+ to purchase.
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-semibold text-gray-900">Quantity</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Remove options */}
          {opts?.removeOptions && opts.removeOptions.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Remove</h3>
              <div className="flex flex-wrap gap-2">
                {opts.removeOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleRemove(opt)}
                    className={cn(
                      'px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors',
                      removed.includes(opt)
                        ? 'border-red-400 bg-red-50 text-red-700 line-through'
                        : 'border-gray-200 text-gray-600'
                    )}
                  >
                    No {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add extras */}
          {opts?.addExtras && opts.addExtras.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Extras</h3>
              <div className="space-y-2">
                {opts.addExtras.map(extra => (
                  <button
                    key={extra.name}
                    onClick={() => toggleExtra(extra)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors',
                      added.find(a => a.name === extra.name)
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-100'
                    )}
                  >
                    <span className="text-gray-800">{extra.name}</span>
                    <span className="text-orange-600 font-medium">+{formatPrice(extra.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Special instructions</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special requests? (e.g. sauce on the side)"
              className="w-full border-2 border-gray-100 rounded-xl p-3 text-sm resize-none focus:border-orange-400 outline-none"
              rows={3}
            />
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="p-4 safe-bottom border-t border-gray-100">
          <button
            onClick={handleAdd}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-between px-6 active:scale-95 transition-transform"
          >
            <span>Add to Cart</span>
            <span>{formatPrice(lineTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
