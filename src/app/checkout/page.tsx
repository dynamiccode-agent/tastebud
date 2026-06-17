'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({
  clientSecret,
  customerName,
  customerPhone,
  onSuccess
}: {
  clientSecret: string
  customerName: string
  customerPhone: string
  onSuccess: (paymentIntentId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
      setLoading(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, total, subtotal, venueId, tableNumber, tableId, hasAlcohol, clearCart } = useCart()
  const router = useRouter()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [alcoholConfirmed, setAlcoholConfirmed] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [step, setStep] = useState<'details' | 'payment'>('details')

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  async function handleProceedToPayment() {
    if (!customerName.trim()) return
    if (hasAlcohol && !alcoholConfirmed) return
    setLoading(true)

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          venueId,
          tableNumber,
          tableId,
          customerName,
          customerPhone,
          alcoholConfirmed,
        }),
      })
      const data = await res.json()
      setClientSecret(data.clientSecret)
      setOrderId(data.orderId)
      setStep('payment')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handlePaymentSuccess(piId: string) {
    // Confirm order with backend
    await fetch('/api/confirm-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, paymentIntentId: piId }),
    })
    clearCart()
    router.push(`/order-confirmed?orderId=${orderId}&table=${tableNumber}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white sticky top-0 z-10 px-4 py-4 flex items-center gap-3 shadow-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Logo size="xs" />
      </div>

      <div className="px-4 pt-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

        {/* Table */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <p className="text-sm text-orange-600 font-medium">Ordering from</p>
          <p className="text-xl font-black text-orange-700">Table {tableNumber}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatPrice((item.price + item.customisations.added.reduce((s, a) => s + a.price, 0)) * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-orange-600">{formatPrice(total)}</span>
          </div>
        </div>

        {step === 'details' ? (
          <>
            {/* Customer Details */}
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="font-semibold">Your Details</h3>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Your name *"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-orange-400 outline-none"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Phone number (optional)"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-orange-400 outline-none"
              />
            </div>

            {/* Alcohol confirmation */}
            {hasAlcohol && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="alcohol"
                    checked={alcoholConfirmed}
                    onChange={e => setAlcoholConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 accent-orange-600"
                  />
                  <label htmlFor="alcohol" className="text-sm text-gray-700">
                    I confirm I am 18 years of age or older and legally permitted to purchase alcohol in this venue.
                  </label>
                </div>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              disabled={loading || !customerName.trim() || (hasAlcohol && !alcoholConfirmed)}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40"
            >
              {loading ? 'Setting up payment...' : `Continue to Payment — ${formatPrice(total)}`}
            </button>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Secure payment powered by Stripe</span>
            </div>
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  customerName={customerName}
                  customerPhone={customerPhone}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
