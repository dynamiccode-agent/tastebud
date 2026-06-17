import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { orders, orderItems } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const venueId = searchParams.get('venueId')

  if (!venueId) return NextResponse.json({ error: 'venueId required' }, { status: 400 })

  const allOrders = await db.select().from(orders)
    .where(eq(orders.venueId, venueId))
    .orderBy(desc(orders.createdAt))
    .limit(50)

  const ordersWithItems = await Promise.all(
    allOrders.map(async order => {
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
      return { ...order, items }
    })
  )

  return NextResponse.json(ordersWithItems)
}

export async function PATCH(req: NextRequest) {
  const { orderId, status } = await req.json()
  await db.update(orders).set({ status }).where(eq(orders.id, orderId))
  return NextResponse.json({ success: true })
}
