import { db } from '../../db/index.js'
import { task as taskTable } from '../../db/schema/tasks.js'
import { eq } from 'drizzle-orm'

import type { TaskPriority } from '../../db/schema/tasks.js'

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
  priority?: TaskPriority | null
  dueAt?: Date | null
}

export const taskRepository = {
  findById: async (id: string) => {
    const row = await db.query.task.findFirst({
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
        assignments: {
          columns: {},
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!row) {
      return null
    }

    const { assignments, ...task } = row
    return {
      ...task,
      assignees: assignments.map(({ user }) => user),
    }
  },

  create: async (input: CreateTask) => {
    const [task] = await db.insert(taskTable).values(input).returning()

    return taskRepository.findById(task.id)
  },

  update: async (id: string, input: UpdateTask) => {
    await db.update(taskTable).set(input).where(eq(taskTable.id, id))

    return taskRepository.findById(id)
  },

  delete: async (id: string) => {
    await db.delete(taskTable).where(eq(taskTable.id, id))
  },
}
