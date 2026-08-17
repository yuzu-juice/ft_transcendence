import { AppError } from '../../errors/app-error.js'
import { taskRepository, type CreateTask, type UpdateTask } from './repository.js'

export const taskService = {
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

  delete: async (taskId: string, userId: string, isAdmin: boolean) => {
    const task = await taskRepository.findById(taskId)

    if (!task) {
      throw new AppError('TASK_NOT_FOUND', 404, 'Task not found')
    }
    if (!isAdmin && task.creator?.id != userId) {
      throw new AppError('TASK_FORBIDDEN', 403, 'You cannot modify this task')
    }

    await taskRepository.delete(taskId)
  },
}
