import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { menuItems } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const venueId = searchParams.get('venueId')
  if (!venueId) return NextResponse.json({ error: 'venueId required' }, { status: 400 })

  const items = await db.select().from(menuItems).where(eq(menuItems.venueId, venueId))
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const [item] = await db.insert(menuItems).values(body).returning()
  return NextResponse.json(item)
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json()
  const [item] = await db.update(menuItems).set(updates).where(eq(menuItems.id, id)).returning()
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await db.delete(menuItems).where(eq(menuItems.id, id))
  return NextResponse.json({ success: true })
}
