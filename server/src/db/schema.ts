import { pgTable, serial, varchar, text, timestamp, decimal, integer } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  ticketmasterId: varchar('ticketmaster_id', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 500 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date').notNull(),
  venue: varchar('venue', { length: 500 }),
  city: varchar('city', { length: 255 }),
  country: varchar('country', { length: 255 }),
  imageUrl: varchar('image_url', { length: 1000 }),
  url: varchar('url', { length: 1000 }),
  minPrice: decimal('min_price', { precision: 10, scale: 2 }),
  maxPrice: decimal('max_price', { precision: 10, scale: 2 }),
  category: varchar('category', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
})

export const savedEvents = pgTable('saved_events', {
  id: serial('id').primaryKey(),
  ticketmasterId: varchar('ticketmaster_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 500 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  venue: varchar('venue', { length: 500 }),
  city: varchar('city', { length: 255 }),
  imageUrl: varchar('image_url', { length: 1000 }),
  url: varchar('url', { length: 1000 }),
  category: varchar('category', { length: 255 }),
  savedAt: timestamp('saved_at').defaultNow(),
})