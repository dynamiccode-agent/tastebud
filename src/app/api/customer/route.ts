import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { customers } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const phone = new URL(req.url).searchParams.get('phone')?.trim()
  if (!phone) return NextResponse.json({ customer: null })

  const [customer] = await db
    .select({ id: customers.id, name: customers.name, totalPoints: customers.totalPoints })
    .from(customers)
    .where(eq(customers.phone, phone))
    .limit(1)

  return NextResponse.json({ customer: customer || null })
}
