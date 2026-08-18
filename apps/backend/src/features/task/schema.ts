import { z } from 'zod'
import { taskPriorityEnum, taskStatusEnum } from '../../db/schema/tasks.js'

const statusSchema = z.enum(taskStatusEnum.enumValues)
const prioritySchema = z.enum(taskPriorityEnum.enumValues)

const queryArray = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => {
    if (value === undefined) {
      return undefined
    }

    return Array.isArray(value) ? value : [value]
  }, z.array(schema).optional())

export const searchTaskSchema = z.object({
  q: z.string().max(200).optional(),
  status: queryArray(statusSchema),
  priority: queryArray(prioritySchema),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  createdBy: z.string().optional(),
  assigneeId: z.string().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'dueAt', 'status', 'priority']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
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

export const patchTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullable().optional(),
    status: z.enum(taskStatusEnum.enumValues).optional(),
    priority: z.enum(taskPriorityEnum.enumValues).nullable().optional(),
    dueAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: 'You must enter a value in at least one field.',
  })

export type PatchTaskInput = z.infer<typeof patchTaskSchema>

export const putTaskAssigneesSchema = z.object({
  userIds: z.array(z.string()).refine((items) => new Set(items).size === items.length, {
    message: 'userID must contain unique values',
  }),
})

export type PutTaskAssigneesInput = z.infer<typeof putTaskAssigneesSchema>
