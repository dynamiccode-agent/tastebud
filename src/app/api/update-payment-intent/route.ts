import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const { orderId, newTotal } = await req.json()

  const [order] = await db.select({ paymentIntentId: orders.paymentIntentId })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)

  if (!order?.paymentIntentId) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const amountInCents = Math.max(50, Math.round(newTotal * 100))
  await stripe.paymentIntents.update(order.paymentIntentId, { amount: amountInCents })

  return NextResponse.json({ success: true, amountInCents })
}
