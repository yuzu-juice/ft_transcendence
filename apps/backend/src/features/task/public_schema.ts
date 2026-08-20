import { z } from '@hono/zod-openapi'
import { taskPriorityEnum, taskStatusEnum } from '../../db/schema/tasks.js'

const statusSchema = z.enum(taskStatusEnum.enumValues)
const prioritySchema = z.enum(taskPriorityEnum.enumValues)

// GET /api/tasks 用（単純な一覧取得）

export const listTaskSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .openapi({ param: { name: 'page', in: 'query' }, example: 1 }),
})

export type ListTaskInput = z.infer<typeof listTaskSchema>

// POST /api/tasks 用（作成）

export const createTaskSchema = z
  .object({
    title: z.string().min(1).max(200).openapi({ example: '買い物に行く' }),
    description: z.string().max(2000).nullable().optional().openapi({ example: '牛乳と卵を買う' }),
    priority: prioritySchema.nullable().optional().openapi({ example: 'medium' }),
    dueAt: z.coerce.date().nullable().optional().openapi({ example: '2026-09-10T00:00:00Z' }),
  })
  .openapi('CreateTaskInput')

export type CreateTaskInput = z.infer<typeof createTaskSchema>

// GET/PATCH/DELETE /api/tasks/:taskId 用（パラメータ）

export const taskIdParamSchema = z.object({
  taskId: z.uuid().openapi({
    param: { name: 'taskId', in: 'path' },
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),
})

export type TaskIdParamInput = z.infer<typeof taskIdParamSchema>

// PATCH /api/tasks/:taskId 用（部分更新）

export const patchTaskSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullable().optional(),
    status: statusSchema.optional(),
    priority: prioritySchema.nullable().optional(),
    dueAt: z.coerce.date().nullable().optional(),
  })
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: 'You must enter a value in at least one field.',
  })
  .openapi('PatchTaskInput')

export type PatchTaskInput = z.infer<typeof patchTaskSchema>

const publicUserSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable(),
  })
  .openapi('UserSummary')

// レスポンス用

export const publicTaskSchema = z
  .object({
    id: z.uuid(),
    title: z.string(),
    description: z.string().nullable(),
    status: statusSchema,
    priority: prioritySchema.nullable(),
    dueAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    creator: publicUserSummarySchema.nullable(),
    assignees: z.array(publicUserSummarySchema),
  })
  .openapi('Task')

export const publicTaskPageSchema = z.array(publicTaskSchema).openapi('TaskPage')
