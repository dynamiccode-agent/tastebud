'use client'
import { useCart } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Logo } from './Logo'
import { MapPin } from 'lucide-react'

interface Props {
  venue: { id: string; name: string; primaryColor?: string | null }
  table: { id: string; tableNumber: string; label?: string | null } | null
  tableNumber: string
}

export function TableConfirm({ venue, table, tableNumber }: Props) {
  const { setTable } = useCart()
  const router = useRouter()
  const [customTable, setCustomTable] = useState('')
  const [changing, setChanging] = useState(false)

  const displayTable = table?.label || `Table ${tableNumber}`

  function handleConfirm() {
    const tNum = changing ? customTable : tableNumber
    setTable(venue.id, tNum, table?.id || '')
    router.push(`/venue/${venue.id}/menu`)
  }

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <div className="flex items-center justify-center p-6 pt-12">
        <Logo size="lg" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mx-auto mb-6">
            <MapPin className="w-8 h-8 text-orange-600" />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            {venue.name}
          </h1>

          {!changing ? (
            <>
              <p className="text-gray-500 text-center mb-2">You're ordering from</p>
              <p className="text-3xl font-black text-orange-600 text-center mb-8">{displayTable}</p>

              <button
                onClick={handleConfirm}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl text-lg font-bold shadow-md active:scale-95 transition-transform mb-3"
              >
                Confirm — Start Ordering
              </button>
              <button
                onClick={() => setChanging(true)}
                className="w-full text-gray-500 py-2 text-sm"
              >
                Change table
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-center mb-4">Enter your table number</p>
              <input
                type="text"
                value={customTable}
                onChange={e => setCustomTable(e.target.value)}
                placeholder="e.g. 12"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg text-center mb-4 focus:border-orange-500 outline-none"
                autoFocus
              />
              <button
                onClick={handleConfirm}
                disabled={!customTable.trim()}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl text-lg font-bold shadow-md active:scale-95 transition-transform disabled:opacity-40 mb-3"
              >
                Confirm Table
              </button>
              <button
                onClick={() => setChanging(false)}
                className="w-full text-gray-500 py-2 text-sm"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
