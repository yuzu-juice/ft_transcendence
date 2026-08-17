import { db } from '../../db/index.js'
import { task as taskTable, taskAssignment as taskAssignmentTable } from '../../db/schema/tasks.js'
import {
  eq,
  gte,
  ilike,
  inArray,
  or,
  lte,
  exists,
  and,
  sql,
  asc,
  desc,
  type SQL,
} from 'drizzle-orm'

import type { TaskPriority, TaskStatus } from '../../db/schema/tasks.js'

export type CreateTask = {
  title: string
  description: string | null
  priority: TaskPriority | null
  createdBy: string
  dueAt: Date | null
}

export type UpdateTask = {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority | null
  dueAt?: Date | null
}

export type SearchTasks = {
  q?: string
  status?: TaskStatus[]
  priority?: TaskPriority[]
  dueFrom?: Date
  dueTo?: Date
  createdBy?: string
  assigneeId?: string

  sort: 'createdAt' | 'updatedAt' | 'dueAt' | 'status' | 'priority'
  order: 'asc' | 'desc'
  page: number
}

export const PAGE_SIZE = 20

function buildTaskWhere(t: typeof taskTable, input: SearchTasks): SQL {
  const conditions: SQL[] = []

  if (input.q) {
    const condition = or(ilike(t.title, `%${input.q}%`), ilike(t.description, `%${input.q}%`))

    if (condition) {
      conditions.push(condition)
    }
  }

  if (input.status?.length) {
    conditions.push(inArray(t.status, input.status))
  }

  if (input.priority?.length) {
    conditions.push(inArray(t.priority, input.priority))
  }

  if (input.dueFrom) {
    conditions.push(gte(t.dueAt, input.dueFrom))
  }

  if (input.dueTo) {
    conditions.push(lte(t.dueAt, input.dueTo))
  }

  if (input.createdBy) {
    conditions.push(eq(t.createdBy, input.createdBy))
  }

  if (input.assigneeId) {
    conditions.push(
      exists(
        db
          .select({ id: taskAssignmentTable.taskId })
          .from(taskAssignmentTable)
          .where(
            and(
              eq(taskAssignmentTable.taskId, t.id),
              eq(taskAssignmentTable.userId, input.assigneeId),
            ),
          ),
      ),
    )
  }

  return and(...conditions) ?? sql`true`
}

export const taskRepository = {
  search: async (input: SearchTasks) => {
    const offset = (input.page - 1) * PAGE_SIZE

    const [data, total] = await Promise.all([
      db.query.task.findMany({
        where: {
          RAW: (t) => buildTaskWhere(t, input),
        },
        columns: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          dueAt: true,
          createdAt: true,
          updatedAt: true,
        },

        with: {
          creator: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },

          assignees: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },

        orderBy: (t) => {
          const column = {
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            dueAt: t.dueAt,
            status: t.status,
            priority: t.priority,
          }[input.sort]

          const direction = input.order === 'asc' ? asc : desc

          return [direction(column), direction(t.id)]
        },

        limit: PAGE_SIZE,
        offset,
      }),
      db.$count(taskTable, buildTaskWhere(taskTable, input)),
    ])

    return {
      data,
      total,
    }
  },

  findById: async (id: string) => {
    const task = await db.query.task.findFirst({
      where: {
        id,
      },
      columns: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueAt: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
        assignees: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return task ?? null
  },

  create: async (input: CreateTask) => {
    const [task] = await db.insert(taskTable).values(input).returning()

    return taskRepository.findById(task.id)
  },

  update: async (id: string, input: UpdateTask) => {
    await db.update(taskTable).set(input).where(eq(taskTable.id, id))

    return taskRepository.findById(id)
  },

  setAssignees: async (taskId: string, userIds: string[]) => {
    await db.transaction(async (tx) => {
      await tx.delete(taskAssignmentTable).where(eq(taskAssignmentTable.taskId, taskId))

      if (userIds.length > 0) {
        await tx.insert(taskAssignmentTable).values(userIds.map((userId) => ({ taskId, userId })))
      }
    })
    return taskRepository.findById(taskId)
  },

  delete: async (id: string) => {
    await db.delete(taskTable).where(eq(taskTable.id, id))
  },
}
