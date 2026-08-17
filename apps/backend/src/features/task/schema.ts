import { z } from 'zod'
import { taskPriorityEnum, taskStatusEnum } from '../../db/schema/tasks.js'

export const searchTaskSchema = z.object({
  q: z.string().max(200).optional(),
  status: z.array(z.enum(taskStatusEnum.enumValues)).optional(),
  priority: z.array(z.enum(taskPriorityEnum.enumValues)).optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  createdBy: z.string().optional(),
  assigneeId: z.string().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'dueAt', 'status', 'priority']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.int().default(1),
})

export type SearchTaskInput = z.infer<typeof searchTaskSchema>

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
  status: z.enum(taskStatusEnum.enumValues).optional(),
  priority: z.enum(taskPriorityEnum.enumValues).nullable().optional(),
  dueAt: z.coerce.date().nullable().optional(),
})

export type PatchTaskInput = z.infer<typeof patchTaskSchema>

export const putTaskAssigneesSchema = z.object({
  userIds: z.array(z.string()).refine((items) => new Set(items).size === items.length, {
    message: 'userID must contain unique values',
  }),
})

export type PutTaskAssigneesInput = z.infer<typeof putTaskAssigneesSchema>
