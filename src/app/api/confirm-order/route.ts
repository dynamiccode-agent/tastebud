import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const { orderId, paymentIntentId } = await req.json()

  await db.update(orders)
    .set({ paymentStatus: 'paid', status: 'new' })
    .where(eq(orders.id, orderId))

  return NextResponse.json({ success: true })
}
