'use client'
import { useEffect, useState, useCallback } from 'react'
import { formatPrice } from '@/lib/utils'

const VENUE_ID = '11111111-1111-1111-1111-111111111111'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: string
  categoryId: string
  isAlcohol: boolean | null
  available: boolean | null
  image: string | null
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')

  const fetchData = useCallback(async () => {
    const [itemsRes, catsRes] = await Promise.all([
      fetch(`/api/menu?venueId=${VENUE_ID}`),
      fetch(`/api/categories?venueId=${VENUE_ID}`),
    ])
    setItems(await itemsRes.json())
    setCategories(await catsRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function toggleAvailability(item: MenuItem) {
    await fetch('/api/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, available: !item.available }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))
  }

  async function savePrice(item: MenuItem) {
    const price = parseFloat(editPrice)
    if (isNaN(price)) return
    await fetch('/api/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, price: price.toString() }),
    })
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, price: price.toString() } : i))
    setEditingId(null)
  }

  const grouped = categories.map(cat => ({
    cat,
    items: items.filter(i => i.categoryId === cat.id),
  })).filter(g => g.items.length > 0)

  if (loading) return <div className="p-6 text-gray-400">Loading menu...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Menu Management</h1>

      {grouped.map(({ cat, items: catItems }) => (
        <div key={cat.id} className="mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-3">{cat.name}</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Item</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-center px-4 py-3">Alcohol</th>
                  <th className="text-center px-4 py-3">Available</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {catItems.map(item => (
                  <tr key={item.id} className={item.available ? '' : 'opacity-50'}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.description && <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            className="w-20 border rounded px-2 py-1 text-sm"
                            autoFocus
                          />
                          <button onClick={() => savePrice(item)} className="text-green-600 text-sm font-medium">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(item.id); setEditPrice(item.price) }}
                          className="font-medium text-gray-900 hover:text-orange-600"
                        >
                          {formatPrice(item.price)}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.isAlcohol ? (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">18+</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${item.available ? 'bg-orange-600' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.available ? 'left-6' : 'left-1'}`} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
