import { defineRelations } from 'drizzle-orm'
import * as schema from './schema/index.js'

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),

    createdTasks: r.many.task({
      from: r.user.id,
      to: r.task.createdBy,
    }),

    assignedTasks: r.many.task({
      from: r.user.id.through(r.taskAssignment.userId),
      to: r.task.id.through(r.taskAssignment.taskId),
    }),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },

  task: {
    creator: r.one.user({
      from: r.task.createdBy,
      to: r.user.id,
    }),

    assignees: r.many.user({
      from: r.task.id.through(r.taskAssignment.taskId),
      to: r.user.id.through(r.taskAssignment.userId),
    }),
  },

  taskAssignment: {
    task: r.one.task({
      from: r.taskAssignment.taskId,
      to: r.task.id,
    }),

    user: r.one.user({
      from: r.taskAssignment.userId,
      to: r.user.id,
    }),
  },
}))
