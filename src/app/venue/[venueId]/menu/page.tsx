import { db } from '@/db'
import { venues, categories, menuItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { MenuPage } from '@/components/MenuPage'

export default async function MenuRoute({ params }: { params: Promise<{ venueId: string }> }) {
  const { venueId } = await params

  const [venue] = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1)
  if (!venue) notFound()

  const cats = await db.select().from(categories)
    .where(and(eq(categories.venueId, venueId), eq(categories.active, true)))
    .orderBy(categories.sortOrder)

  const items = await db.select().from(menuItems)
    .where(and(eq(menuItems.venueId, venueId)))
    .orderBy(menuItems.name)

  return <MenuPage venue={venue} categories={cats} items={items} />
}
