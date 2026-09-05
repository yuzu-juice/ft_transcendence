import z from 'zod'

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'done'])
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high'])
export const TaskPriorityFormSchema = z.union([TaskPrioritySchema, z.literal('')])

export const TaskSortSchema = z.enum(['createdAt', 'updatedAt', 'dueAt', 'status', 'priority'])
export const TaskOrderSchema = z.enum(['asc', 'desc'])

export const DEFAULT_TASK_SEARCH = {
  status: ['todo', 'in_progress'],
  sort: 'dueAt',
  order: 'asc',
  page: 1,
} as const

export const DEFAULT_TASK_SEARCH_FORM = {
  q: '',
  status: ['todo', 'in_progress'] as const,
  priority: [],
  dueFrom: '',
  dueTo: '',
  createdBy: '',
  assigneeId: '',
  sort: 'dueAt' as const,
  order: 'asc' as const,
}

// .catch()は不正な値を安全な値に置き換える
export const TaskSearchParamsSchema = z.object({
  q: z.string().max(200).optional().catch(undefined),
  status: z
    .array(TaskStatusSchema)
    .default([...DEFAULT_TASK_SEARCH.status])
    .optional()
    .catch(['todo', 'in_progress']),
  priority: z.array(TaskPrioritySchema).optional().catch(undefined),
  dueFrom: z.iso.datetime().optional().catch(undefined),
  dueTo: z.iso.datetime().optional().catch(undefined),
  createdBy: z.string().optional().catch(undefined),
  assigneeId: z.string().optional().catch(undefined),
  sort: TaskSortSchema.default(DEFAULT_TASK_SEARCH.sort).catch(DEFAULT_TASK_SEARCH.sort),
  order: TaskOrderSchema.default(DEFAULT_TASK_SEARCH.order).catch(DEFAULT_TASK_SEARCH.order),
  page: z.number().int().min(1).default(DEFAULT_TASK_SEARCH.page).catch(DEFAULT_TASK_SEARCH.page),
})

export type TaskSearchParamsInput = z.infer<typeof TaskSearchParamsSchema>

export const TaskSearchFormSchema = z
  .object({
    q: z.string().max(200, 'キーワードは200文字以内で入力してください'),
    status: z.array(TaskStatusSchema),
    priority: z.array(TaskPrioritySchema),
    dueFrom: z.string(),
    dueTo: z.string(),
    createdBy: z.string(),
    assigneeId: z.string(),
    sort: TaskSortSchema,
    order: TaskOrderSchema,
  })
  .refine(
    (data) =>
      !(data.dueFrom !== '' && data.dueTo !== '' && new Date(data.dueFrom) > new Date(data.dueTo)),
    {
      message: '締切日時の期間指定が不正です',
      path: ['dueTo'],
    },
  )

export type TaskSearchFormInput = z.infer<typeof TaskSearchFormSchema>

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
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください').optional(),
  priority: TaskPrioritySchema.optional(),
  dueAt: z.string().optional(),
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

export type TaskUpdateFormInput = z.infer<typeof TaskUpdateFormSchema>

export const TaskUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'タスク名を入力してください')
    .max(200, 'タスク名は200文字以内で入力してください'),
  description: z.string().max(2000, 'タスクの説明は2000文字以内で入力してください').optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema.optional(),
  dueAt: z.iso.datetime().optional(),
})

export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>

export const TaskAssigneesUpdateSchema = z.object({
  assigneeIds: z.array(z.string()),
})

export type TaskAssigneesUpdateInput = z.infer<typeof TaskAssigneesUpdateSchema>
