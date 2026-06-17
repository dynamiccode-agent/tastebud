import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { CartItem } from '@/types'

export async function POST(req: NextRequest) {
  const { items, total, venueId, tableNumber, tableId, customerName, customerPhone, alcoholConfirmed } = await req.json()

  const subtotal = total
  const amountInCents = Math.round(total * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'aud',
    metadata: { venueId, tableNumber, customerName },
  })

  // Create order in DB
  const [order] = await db.insert(orders).values({
    venueId,
    tableId: tableId || null,
    tableNumber,
    customerName,
    customerPhone: customerPhone || null,
    status: 'new',
    paymentStatus: 'pending',
    paymentIntentId: paymentIntent.id,
    subtotal: subtotal.toString(),
    total: total.toString(),
    alcoholConfirmed: alcoholConfirmed || false,
  }).returning()

  // Insert order items
  await db.insert(orderItems).values(
    items.map((item: CartItem) => ({
      orderId: order.id,
      menuItemId: item.menuItemId,
      nameSnapshot: item.name,
      priceSnapshot: item.price.toString(),
      quantity: item.quantity,
      customisations: item.customisations,
      notes: item.notes || null,
    }))
  )

  return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId: order.id })
}
