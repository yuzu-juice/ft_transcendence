import z from 'zod'

// TODO(low): hono RPCからstatus/priorityのenumスキーマを生成する?

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'done'])
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high'])
export const TaskPriorityFormSchema = z.union([TaskPrioritySchema, z.literal('')])

// フォーム用のスキーマ
// フォーム入力の都合で、nullに相当する値を空文字列として扱う
// onSubmit時に空文字列をnullに変換する
export const TaskCreateFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください'),
  priority: TaskPriorityFormSchema,
  dueAt: z.string(),
})

// API用のスキーマ
export const TaskCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください').nullable(),
  priority: TaskPrioritySchema.nullable(),
  dueAt: z.string().nullable(),
})

export type TaskCreateInput = z.infer<typeof TaskCreateSchema>

export const TaskUpdateFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください'),
  status: TaskStatusSchema,
  priority: TaskPriorityFormSchema,
  dueAt: z.string(),
})

export const TaskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください').nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema.nullable(),
  dueAt: z.string().nullable(), // TODO Date型にする?
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>

export const TaskAssigneesUpdateSchema = z.object({
  assigneeIds: z.array(z.string()),
})

export type TaskAssigneesUpdateInput = z.infer<typeof TaskAssigneesUpdateSchema>
