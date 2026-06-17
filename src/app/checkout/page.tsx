'use client'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PayForm({
  onSuccess,
  disabled,
  total,
}: {
  onSuccess: (piId: string) => void
  disabled: boolean
  total: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements || disabled) return
    setLoading(true)
    setError('')
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })
    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Please try again.')
      setLoading(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !stripe || disabled}
        className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        style={{ backgroundColor: disabled ? '#d1d5db' : '#F9BA0B', color: '#000' }}
      >
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : `Pay ${formatPrice(total)}`}
      </button>
      {disabled && (
        <p className="text-center text-xs text-gray-400">Enter your name above to enable payment</p>
      )}
    </form>
  )
}

export default function CheckoutPage() {
  const { items, total, venueId, tableNumber, tableId, hasAlcohol, clearCart } = useCart()
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [alcoholConfirmed, setAlcoholConfirmed] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState('')
  const [prewarming, setPrewarming] = useState(true)
  const prewarmed = useRef(false)

  // Pre-warm: fire PI creation immediately on mount, don't wait for name
  useEffect(() => {
    if (prewarmed.current || items.length === 0 || !venueId) return
    prewarmed.current = true

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items, total, venueId, tableNumber, tableId,
        customerName: '', customerPhone: '', alcoholConfirmed: false,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setClientSecret(data.clientSecret)
        setOrderId(data.orderId)
      })
      .finally(() => setPrewarming(false))
  }, [items, total, venueId, tableNumber, tableId])

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  async function handlePaymentSuccess(piId: string) {
    await fetch('/api/confirm-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        paymentIntentId: piId,
        customerName: customerName.trim() || 'Guest',
        customerPhone,
      }),
    })
    clearCart()
    router.push(`/order-confirmed?orderId=${orderId}&table=${tableNumber}`)
  }

  const canPay = customerName.trim().length > 0 && (!hasAlcohol || alcoholConfirmed)

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 flex items-center gap-3 shadow-sm bg-white">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Logo size="xs" />
      </div>

      <div className="px-4 pt-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

        {/* Table */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: '#FEF9D3', border: '1px solid #F9BA0B' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#F9BA0B' }}>
            📍
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ordering from</p>
            <p className="text-lg font-black text-gray-900">Table {tableNumber}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1.5">
              <span className="flex gap-1.5">
                <span className="text-gray-400">{item.quantity}×</span>
                <span>{item.name}</span>
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice((item.price + item.customisations.added.reduce((s, a) => s + a.price, 0)) * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-base">
            <span>Total</span>
            <span style={{ color: '#d4960a' }}>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Your Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Your Details</h3>
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Your name *"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            style={{ borderColor: customerName ? '#F9BA0B' : undefined }}
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            placeholder="Phone number (optional)"
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
          />
        </div>

        {/* Alcohol confirmation */}
        {hasAlcohol && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={alcoholConfirmed}
                onChange={e => setAlcoholConfirmed(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded"
                style={{ accentColor: '#F9BA0B' }}
              />
              <span className="text-sm text-gray-700 leading-snug">
                I confirm I am 18 years of age or older and legally permitted to purchase alcohol in this venue.
              </span>
            </label>
          </div>
        )}

        {/* Payment — loads immediately, disabled until name filled */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500 font-medium">Secure payment powered by Stripe</span>
          </div>

          {prewarming ? (
            <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Setting up payment...</span>
            </div>
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: { colorPrimary: '#F9BA0B', borderRadius: '12px' },
                },
              }}
            >
              <PayForm onSuccess={handlePaymentSuccess} disabled={!canPay} total={total} />
            </Elements>
          ) : (
            <p className="text-sm text-red-500 text-center py-4">
              Could not set up payment. Please go back and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
