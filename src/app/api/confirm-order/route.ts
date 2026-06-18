import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, customers, pointsLedger } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { calcPointsEarned } from '@/lib/rewards'

export async function POST(req: NextRequest) {
  const {
    orderId,
    paymentIntentId,
    customerName,
    customerPhone,
    pointsRedeemed = 0,
    discountAmount = 0,
  } = await req.json()

  await db.update(orders)
    .set({
      paymentStatus: 'paid',
      status: 'new',
      pointsRedeemed,
      discountAmount: discountAmount.toString(),
      ...(customerName?.trim() ? { customerName: customerName.trim() } : {}),
      ...(customerPhone?.trim() ? { customerPhone: customerPhone.trim() } : {}),
    })
    .where(eq(orders.id, orderId))

  if (!customerPhone?.trim()) {
    return NextResponse.json({ success: true, pointsEarned: 0, newBalance: null })
  }

  const [order] = await db.select({ total: orders.total })
    .from(orders).where(eq(orders.id, orderId)).limit(1)

  const paidDollars = Math.max(0, parseFloat(order.total) - discountAmount)
  const pointsEarned = calcPointsEarned(paidDollars)

  // Find or create customer
  let [customer] = await db.select()
    .from(customers)
    .where(eq(customers.phone, customerPhone.trim()))
    .limit(1)

  if (!customer) {
    ;[customer] = await db.insert(customers).values({
      phone: customerPhone.trim(),
      name: customerName?.trim() || 'Guest',
      totalPoints: 0,
    }).returning()
  }

  let runningBalance = customer.totalPoints

  if (pointsRedeemed > 0) {
    runningBalance -= pointsRedeemed
    await db.insert(pointsLedger).values({
      customerId: customer.id,
      orderId,
      delta: -pointsRedeemed,
      balanceAfter: runningBalance,
      type: 'redeem',
    })
  }

  runningBalance += pointsEarned
  await db.insert(pointsLedger).values({
    customerId: customer.id,
    orderId,
    delta: pointsEarned,
    balanceAfter: runningBalance,
    type: 'earn',
  })

  await db.update(customers)
    .set({ totalPoints: runningBalance, updatedAt: new Date() })
    .where(eq(customers.id, customer.id))

  await db.update(orders)
    .set({ customerId: customer.id, pointsEarned })
    .where(eq(orders.id, orderId))

  return NextResponse.json({ success: true, pointsEarned, newBalance: runningBalance })
}
