'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

interface Props {
  message: string | null
  onDone: () => void
}

export function AddedToast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 2200)
    return () => clearTimeout(t)
  }, [message, onDone])

  if (!message) return null

  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full shadow-xl text-sm font-medium whitespace-nowrap">
        <span className="flex items-center justify-center w-5 h-5 bg-[#F9BA0B] rounded-full flex-shrink-0">
          <Check className="w-3 h-3 text-black" strokeWidth={3} />
        </span>
        {message}
      </div>
    </div>
  )
}
