'use client'
import { useEffect, useState, useCallback } from 'react'
import { formatPrice } from '@/lib/utils'

const VENUE_ID = '11111111-1111-1111-1111-111111111111'

const STATUS_FLOW: Record<string, string> = {
  new: 'accepted',
  accepted: 'preparing',
  preparing: 'ready',
  ready: 'completed',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-orange-100 text-orange-700',
  accepted: 'bg-blue-100 text-blue-700',
  preparing: 'bg-yellow-100 text-yellow-800',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const NEXT_ACTION: Record<string, string> = {
  new: 'Accept',
  accepted: 'Start Preparing',
  preparing: 'Mark Ready',
  ready: 'Complete',
}

interface OrderItem {
  id: string
  nameSnapshot: string
  priceSnapshot: string
  quantity: number
  customisations: { removed?: string[]; added?: { name: string; price: number }[] } | null
  notes: string | null
}

interface Order {
  id: string
  tableNumber: string
  customerName: string
  status: string
  paymentStatus: string
  total: string
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    const res = await fetch(`/api/orders?venueId=${VENUE_ID}`)
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  async function updateStatus(orderId: string, status: string) {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    })
    fetchOrders()
  }

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status))
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>
          <p className="text-sm text-gray-400">Auto-refreshes every 10 seconds</p>
        </div>
        <button onClick={fetchOrders} className="text-sm text-orange-600 font-medium px-4 py-2 border border-orange-200 rounded-lg hover:bg-orange-50">
          Refresh
        </button>
      </div>

      {activeOrders.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 mb-6">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-medium">No active orders right now</p>
        </div>
      )}

      {/* Active Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-2xl font-black text-gray-900">Table {order.tableNumber}</span>
                <p className="text-sm text-gray-500">{order.customerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items.map(item => (
                <div key={item.id} className="text-sm">
                  <span className="font-medium">{item.quantity}× {item.nameSnapshot}</span>
                  {item.customisations?.removed && item.customisations.removed.length > 0 && (
                    <p className="text-red-500 text-xs pl-4">No: {item.customisations.removed.join(', ')}</p>
                  )}
                  {item.customisations?.added && item.customisations.added.length > 0 && (
                    <p className="text-green-600 text-xs pl-4">+ {item.customisations.added.map((a: { name: string }) => a.name).join(', ')}</p>
                  )}
                  {item.notes && (
                    <p className="text-gray-400 text-xs pl-4 italic">&quot;{item.notes}&quot;</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
            </div>

            <div className="flex gap-2">
              {NEXT_ACTION[order.status] && (
                <button
                  onClick={() => updateStatus(order.id, STATUS_FLOW[order.status])}
                  className="flex-1 bg-orange-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors"
                >
                  {NEXT_ACTION[order.status]}
                </button>
              )}
              {order.status !== 'cancelled' && (
                <button
                  onClick={() => updateStatus(order.id, 'cancelled')}
                  className="px-3 py-2 border border-red-200 text-red-500 rounded-xl text-sm hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-gray-700 mb-3">Completed / Cancelled</h2>
          <div className="space-y-2">
            {pastOrders.slice(0, 10).map(order => (
              <div key={order.id} className="bg-white rounded-xl p-4 flex items-center justify-between opacity-70">
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="font-medium text-gray-700">Table {order.tableNumber}</span>
                  <span className="text-gray-500 text-sm">{order.customerName}</span>
                  <span className="text-gray-400 text-xs">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <span className="font-bold text-gray-700">{formatPrice(order.total)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
