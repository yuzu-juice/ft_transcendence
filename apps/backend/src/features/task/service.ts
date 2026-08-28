import { AppError } from '../../errors/app-error.js'
import { userRepository } from '../user/repository.js'
import {
  type CreateTask,
  PAGE_SIZE,
  type SearchTasks,
  taskRepository,
  type UpdateTask,
} from './repository.js'

export const taskService = {
  search: async (input: SearchTasks) => {
    const { data, total } = await taskRepository.search(input)

    return {
      data,
      meta: {
        page: input.page,
        perPage: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
      },
    }
  },

  get: async (taskId: string) => {
    const task = await taskRepository.findById(taskId)

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 404, 'Task not found')
    }

    return task
  },

  create: async (input: CreateTask) => {
    return await taskRepository.create(input)
  },

  update: async (taskId: string, input: UpdateTask) => {
    const task = await taskRepository.update(taskId, input)

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 404, 'Task not found')
    }

    return task
  },

  // Each element in userIds must be unique.
  updateAssignees: async (taskId: string, userIds: string[]) => {
    const task = await taskRepository.findById(taskId)

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 404, 'Task not found')
    }

    const users = await userRepository.findByIds(userIds)

    if (users.length !== new Set(userIds).size) {
      throw new AppError('ASSIGNEE_NOT_FOUND', 404, 'Assignee not found')
    }

    const result = await taskRepository.setAssignees(taskId, userIds)

    return result
  },

  delete: async (taskId: string, userId: string, isAdmin: boolean) => {
    const task = await taskRepository.findById(taskId)

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 404, 'Task not found')
    }
    if (!isAdmin && task.creator?.id !== userId) {
      throw new AppError('TASK_FORBIDDEN', 403, 'You cannot modify this task')
    }

    await taskRepository.delete(taskId)
  },

  getAnalyticsSummary: async () => {
    const { totalTasksCount, statusCounts, priorityCounts, overdueCount } =
      await taskRepository.getAnalyticsSummary()

    const byStatus = {
      todo: 0,
      in_progress: 0,
      done: 0,
    }
    for (const { status, count } of statusCounts) {
      byStatus[status] = count
    }

    const byPriority = {
      low: 0,
      medium: 0,
      high: 0,
      unset: 0,
    }

    for (const row of priorityCounts) {
      if (row.priority === null) {
        byPriority.unset = row.count
      } else {
        byPriority[row.priority] = row.count
      }
    }

    const completionRate = totalTasksCount === 0 ? 0 : byStatus.done / totalTasksCount

    return {
      totalTasksCount,
      byStatus,
      byPriority,
      overdueCount,
      completionRate,
    }
  },
}
