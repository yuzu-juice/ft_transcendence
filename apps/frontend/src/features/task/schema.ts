import z from 'zod'

// TODO(low): hono RPCからstatus/priorityのenumスキーマを生成する?

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'done'])
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high'])
export const TaskPriorityFormSchema = z.union([TaskPrioritySchema, z.literal('')])

export const TaskUpdateFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください').nullable(),
  status: TaskStatusSchema,
  priority: TaskPriorityFormSchema,
  dueAt: z.string().nullable(),
})

export const TaskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください').nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema.nullable(),
  dueAt: z.string().nullable(),
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>
