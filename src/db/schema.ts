import { pgTable, text, uuid, integer, boolean, timestamp, jsonb, numeric, pgEnum } from 'drizzle-orm/pg-core'

export const orderStatusEnum = pgEnum('order_status', ['new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'])
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded'])

export const venues = pgTable('venues', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  logo: text('logo'),
  primaryColor: text('primary_color').default('#ea580c'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const tables = pgTable('tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  venueId: uuid('venue_id').notNull().references(() => venues.id),
  tableNumber: text('table_number').notNull(),
  label: text('label'),
  qrUrl: text('qr_url'),
  active: boolean('active').default(true),
})

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  venueId: uuid('venue_id').notNull().references(() => venues.id),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').default(0),
  active: boolean('active').default(true),
})

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  venueId: uuid('venue_id').notNull().references(() => venues.id),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image: text('image'),
  isAlcohol: boolean('is_alcohol').default(false),
  available: boolean('available').default(true),
  customisationOptions: jsonb('customisation_options').$type<{
    removeOptions?: string[]
    addExtras?: { name: string; price: number }[]
  }>(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  venueId: uuid('venue_id').notNull().references(() => venues.id),
  tableId: uuid('table_id').references(() => tables.id),
  tableNumber: text('table_number').notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone'),
  status: orderStatusEnum('status').default('new'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentIntentId: text('payment_intent_id'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  alcoholConfirmed: boolean('alcohol_confirmed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id),
  nameSnapshot: text('name_snapshot').notNull(),
  priceSnapshot: numeric('price_snapshot', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  customisations: jsonb('customisations').$type<{
    removed?: string[]
    added?: { name: string; price: number }[]
  }>(),
  notes: text('notes'),
})
