import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const venueId = searchParams.get('venueId')
  if (!venueId) return NextResponse.json({ error: 'venueId required' }, { status: 400 })

  const cats = await db.select().from(categories)
    .where(eq(categories.venueId, venueId))
    .orderBy(categories.sortOrder)

  return NextResponse.json(cats)
}
