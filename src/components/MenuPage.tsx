'use client'
import { useState, useCallback } from 'react'
import { useCart } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { Logo } from './Logo'
import { ItemModal } from './ItemModal'
import { AddedToast } from './AddedToast'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, UtensilsCrossed } from 'lucide-react'

// Types for props
type Venue = { id: string; name: string; primaryColor?: string | null }
type Category = { id: string; name: string; sortOrder: number | null; active: boolean | null }
type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
  isAlcohol: boolean | null
  available: boolean | null
  categoryId: string
  customisationOptions: {
    removeOptions?: string[]
    addExtras?: { name: string; price: number }[]
  } | null
}

interface Props {
  venue: Venue
  categories: Category[]
  items: MenuItem[]
}

export function MenuPage({ venue, categories, items }: Props) {
  const { itemCount, total } = useCart()
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [badgeBounce, setBadgeBounce] = useState(0)

  const handleItemAdded = useCallback((name: string) => {
    setToastMessage(name + ' added to cart')
    setBadgeBounce(n => n + 1)
  }, [])

  function scrollToCategory(catId: string) {
    setActiveCategory(catId)
    const el = document.getElementById(`cat-${catId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const itemsByCategory = categories.map(cat => ({
    cat,
    items: items.filter(i => i.categoryId === cat.id && i.available),
  })).filter(g => g.items.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20" style={{ backgroundColor: '#F9BA0B' }}>

        {/* Top bar: TasteBud | Venue Logo | Cart */}
        <div className="relative flex items-center justify-between px-4 pt-5 pb-4">

          {/* TasteBud — left, small + muted */}
          <div className="flex flex-col items-start w-20">
            <span className="text-[9px] font-semibold tracking-widest text-black/40 uppercase mb-0.5">Powered by</span>
            <Logo size="xs" className="flex-shrink-0 opacity-90" />
          </div>

          {/* Venue logo — absolute center so it's perfectly centred regardless of side widths */}
          <div className="absolute inset-x-0 flex justify-center pointer-events-none">
            <img
              src="/hoteljardin-logo.svg"
              alt={venue.name}
              className="h-11 w-auto object-contain"
            />
          </div>

          {/* Cart — right */}
          <button
            onClick={() => router.push('/cart')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/10 active:bg-black/20 transition-colors flex-shrink-0"
          >
            <ShoppingCart className="w-5 h-5 text-black" />
            {itemCount > 0 && (
              <span
                key={badgeBounce}
                className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black leading-none animate-bounce"
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/10 mx-4" />

        {/* Category Pills */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                activeCategory === cat.id
                  ? 'bg-black text-white shadow-sm scale-105'
                  : 'bg-white text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="px-4 pt-4">
        {itemsByCategory.map(({ cat, items: catItems }) => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{cat.name}</h2>
            <div className="grid grid-cols-2 gap-3">
              {catItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden text-left active:scale-95 transition-transform"
                >
                  <div className="aspect-square bg-orange-50 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <UtensilsCrossed className="w-10 h-10 text-orange-200" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">{item.name}</p>
                    {item.description && (
                      <p className="text-gray-400 text-xs line-clamp-2 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600">{formatPrice(item.price)}</span>
                      {item.isAlcohol && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">18+</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 safe-bottom z-30">
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl flex items-center justify-between px-6 active:scale-95 transition-transform"
          >
            <span className="bg-orange-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              {itemCount}
            </span>
            <span>View Cart</span>
            <span>{formatPrice(total)}</span>
          </button>
        </div>
      )}

      {/* Toast */}
      <AddedToast message={toastMessage} onDone={() => setToastMessage(null)} />

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAdded={handleItemAdded}
        />
      )}
    </div>
  )
}
