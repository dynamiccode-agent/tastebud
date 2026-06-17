import { db } from '@/db'
import { venues, tables } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { TableConfirm } from '@/components/TableConfirm'

export default async function TablePage({ params }: { params: Promise<{ venueId: string; tableId: string }> }) {
  const { venueId, tableId } = await params

  const [venue] = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1)
  if (!venue) notFound()

  // tableId is actually the table number in the URL
  const [table] = await db.select().from(tables).where(
    and(eq(tables.venueId, venueId), eq(tables.tableNumber, tableId))
  ).limit(1)

  return <TableConfirm venue={venue} table={table || null} tableNumber={tableId} />
}
