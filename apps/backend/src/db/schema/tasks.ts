import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { user } from './auth.js'

export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'done'])

export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high'])

export const task = pgTable(
  'task',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    status: taskStatusEnum('status').default('todo').notNull(),
    priority: taskPriorityEnum('priority'),
    dueAt: timestamp('due_at', { withTimezone: true }),
    createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index('tasks_created_by_index').on(table.createdBy),
    index('tasks_due_at_index').on(table.dueAt),
  ],
)

export const taskAssignment = pgTable(
  'task_assignment',
  {
    taskId: uuid('task_id')
      .references(() => task.id, { onDelete: 'cascade' })
      .notNull(),
    userId: text('user_id')
      .references(() => user.id, { onDelete: 'cascade' })
      .notNull(),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.taskId, table.userId],
    }),
    index('task_assignment_user_id_idx').on(table.userId),
  ],
)
