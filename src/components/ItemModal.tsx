'use client'
import { useState, useRef } from 'react'
import { useCart } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import { UtensilsCrossed } from 'lucide-react'

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
  onAdded?: (itemName: string) => void
}

type Tag = { label: string; bg: string; text: string }

function deriveTags(item: MenuItem): Tag[] {
  const tags: Tag[] = []
  const text = `${item.name} ${item.description || ''}`.toLowerCase()

  if (item.isAlcohol) {
    tags.push({ label: '🔞 18+ only', bg: '#fef3c7', text: '#92400e' })
  }
  if (text.includes('(v)') || text.includes('vegetarian') || text.includes('risotto')) {
    tags.push({ label: '🌱 Vegetarian', bg: '#dcfce7', text: '#166534' })
  }
  if (text.includes('vegan')) {
    tags.push({ label: '🌿 Vegan', bg: '#d1fae5', text: '#064e3b' })
  }
  if (text.includes('gluten') || text.includes('batter') || text.includes('crumb') || text.includes('bread') || text.includes('parma') || text.includes('pastry')) {
    tags.push({ label: '🌾 Gluten', bg: '#fef9c3', text: '#713f12' })
  }
  if (text.includes('nut') || text.includes('walnut') || text.includes('almond') || text.includes('cashew')) {
    tags.push({ label: '🥜 Nuts', bg: '#fef2f2', text: '#991b1b' })
  }
  if (text.includes('dairy') || text.includes('cheese') || text.includes('cream') || text.includes('butter') || text.includes('parmesan') || text.includes('milk')) {
    tags.push({ label: '🥛 Dairy', bg: '#eff6ff', text: '#1e40af' })
  }
  if (text.includes('classic') || text.includes('parma') || text.includes('burger') || text.includes('scotch fillet') || text.includes('pavlova') || text.includes('espresso martini') || text.includes('aperol')) {
    tags.push({ label: '🔥 Popular', bg: '#fff1f2', text: '#be123c' })
  }
  return tags.slice(0, 4)
}

export function ItemModal({ item, onClose, onAdded }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [removed, setRemoved] = useState<string[]>([])
  const [added, setAdded] = useState<{ name: string; price: number }[]>([])
  const [notes, setNotes] = useState('')

  // Swipe-to-dismiss
  const touchStartY = useRef(0)
  const [dragY, setDragY] = useState(0)
  const isDragging = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
    isDragging.current = true
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta > 0) setDragY(delta)
  }
  function onTouchEnd() {
    isDragging.current = false
    if (dragY > 90) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  const basePrice = parseFloat(item.price)
  const extrasTotal = added.reduce((s, a) => s + a.price, 0)
  const lineTotal = (basePrice + extrasTotal) * quantity
  const opts = item.customisationOptions
  const tags = deriveTags(item)

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
    onAdded?.(item.name)
    onClose()
  }

  const opacity = Math.max(0.2, 0.6 - dragY / 300)

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop — fades as you drag */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-75"
        style={{ opacity }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl flex flex-col overflow-hidden"
        style={{
          height: '92dvh',
          transform: `translateY(${dragY}px)`,
          transition: dragY === 0 ? 'transform 0.35s cubic-bezier(0.32,0.72,0,1)' : 'none',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 2. DRAG HANDLE */}
        <div className="absolute top-0 inset-x-0 z-10 flex justify-center pt-2.5 pb-1 pointer-events-none">
          <div className="w-9 h-1 bg-white/60 rounded-full backdrop-blur-sm" />
        </div>

        {/* 4. FULL-BLEED IMAGE with name/price overlaid */}
        <div className="relative flex-shrink-0" style={{ height: '42%' }}>
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <UtensilsCrossed className="w-20 h-20 text-gray-300" />
            </div>
          )}

          {/* Gradient — dark at bottom for text, subtle at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Name + price overlaid */}
          <div className="absolute bottom-0 inset-x-0 px-5 pb-5 pt-10">
            {/* 5. DIETARY TAGS */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map(tag => (
                  <span
                    key={tag.label}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: tag.bg, color: tag.text }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-2xl font-black text-white leading-tight mb-0.5">{item.name}</h2>
            <p className="text-lg font-bold" style={{ color: '#F9BA0B' }}>{formatPrice(item.price)}</p>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2 space-y-5">
          {item.description && (
            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
          )}

          {/* 3. REMOVE OPTIONS — strikethrough + red on select */}
          {opts?.removeOptions && opts.removeOptions.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2.5">Remove</p>
              <div className="flex flex-wrap gap-2">
                {opts.removeOptions.map(opt => {
                  const isRemoved = removed.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleRemove(opt)}
                      className={cn(
                        'px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-150 active:scale-95',
                        isRemoved
                          ? 'border-red-200 bg-red-50 text-red-400 line-through decoration-red-400'
                          : 'border-gray-200 text-gray-700 bg-white'
                      )}
                    >
                      No {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3. EXTRAS — gold highlight + price delta + check mark */}
          {opts?.addExtras && opts.addExtras.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2.5">Add extras</p>
              <div className="space-y-2">
                {opts.addExtras.map(extra => {
                  const isSelected = !!added.find(a => a.name === extra.name)
                  return (
                    <button
                      key={extra.name}
                      onClick={() => toggleExtra(extra)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 active:scale-[0.98] text-left',
                        isSelected
                          ? 'border-[#F9BA0B] bg-[#fffbeb]'
                          : 'border-gray-100 bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150',
                            isSelected ? 'border-[#F9BA0B] bg-[#F9BA0B]' : 'border-gray-300 bg-white'
                          )}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className={cn('text-sm font-medium', isSelected ? 'text-gray-900' : 'text-gray-600')}>
                          {extra.name}
                        </span>
                      </div>
                      <span className={cn('text-sm font-bold', isSelected ? 'text-[#d4960a]' : 'text-gray-400')}>
                        +{formatPrice(extra.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2.5">Special instructions</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special requests? (e.g. sauce on the side)"
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-sm resize-none outline-none transition-colors focus:border-[#F9BA0B]"
              rows={2}
            />
          </div>
          <div className="h-1" />
        </div>

        {/* STICKY BOTTOM: qty + add to cart */}
        <div
          className="px-4 py-3 safe-bottom bg-white flex-shrink-0"
          style={{ borderTop: '2px solid #F9BA0B' }}
        >
          <div className="flex items-center gap-2.5">

            {/* Quantity pill — dark, cohesive with button */}
            <div
              className="flex items-center rounded-2xl px-1 py-1 gap-0.5 flex-shrink-0"
              style={{ backgroundColor: '#111' }}
            >
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform text-white/70 hover:text-white text-xl font-light leading-none select-none"
              >
                −
              </button>
              <span className="text-base font-black w-7 text-center tabular-nums text-white select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform font-bold text-xl leading-none select-none"
                style={{ backgroundColor: '#F9BA0B', color: '#111' }}
              >
                +
              </button>
            </div>

            {/* Add to cart — dark, gold price, physical depth */}
            <button
              onClick={handleAdd}
              className="flex-1 rounded-2xl flex items-center justify-between px-5 select-none transition-all duration-100 active:scale-[0.97]"
              style={{
                background: 'linear-gradient(160deg, #1c1c1c 0%, #111111 100%)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
                paddingTop: '14px',
                paddingBottom: '14px',
              }}
            >
              <span className="text-white font-semibold text-base tracking-wide">Add to cart</span>
              <span
                className="font-black text-base tabular-nums"
                style={{ color: '#F9BA0B' }}
              >
                {formatPrice(lineTotal)}
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
