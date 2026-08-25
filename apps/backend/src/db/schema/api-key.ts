import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth.js'

export const apiKey = pgTable(
  'api_key',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    keyHash: text('key_hash').notNull().unique(),
    keyPrefix: text('key_prefix').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('api_key_user_id_idx').on(table.userId),
    index('api_key_key_prefix_idx').on(table.keyPrefix),
  ],
)
