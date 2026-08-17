import { z } from 'zod'
import { taskPriorityEnum } from '../../db/schema/tasks.js'

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  priority: z.enum(taskPriorityEnum.enumValues).nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export const taskIdParamSchema = z.object({
  taskId: z.uuid(),
})

export type TaskIdParamInput = z.infer<typeof taskIdParamSchema>

export const patchTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  priority: z.enum(taskPriorityEnum.enumValues).nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
})

export type PatchTaskInput = z.infer<typeof patchTaskSchema>
