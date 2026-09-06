import z from 'zod'
import type {
  TaskAssigneesUpdateRequestBody,
  TaskCreateRequestBody,
  TaskListQuery,
  TaskUpdateRequestBody,
} from './api'
import { toDateTimeLocal } from './time'

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
  status: DEFAULT_TASK_SEARCH.status,
  priority: [],
  dueFrom: '',
  dueTo: '',
  createdBy: '',
  assigneeId: '',
  sort: DEFAULT_TASK_SEARCH.sort,
  order: DEFAULT_TASK_SEARCH.order,
}

// .catch()は不正な値を安全な値に置き換える
export const TaskSearchParamsSchema = z.object({
  q: z.string().max(200).optional().catch(undefined),
  status: z
    .array(TaskStatusSchema)
    .default([...DEFAULT_TASK_SEARCH.status])
    .optional()
    .catch([...DEFAULT_TASK_SEARCH.status]),
  priority: z.array(TaskPrioritySchema).optional().catch(undefined),
  dueFrom: z.iso.datetime().optional().catch(undefined),
  dueTo: z.iso.datetime().optional().catch(undefined),
  createdBy: z.string().optional().catch(undefined),
  assigneeId: z.string().optional().catch(undefined),
  sort: TaskSortSchema.default(DEFAULT_TASK_SEARCH.sort).catch(DEFAULT_TASK_SEARCH.sort),
  order: TaskOrderSchema.default(DEFAULT_TASK_SEARCH.order).catch(DEFAULT_TASK_SEARCH.order),
  page: z.number().int().min(1).default(DEFAULT_TASK_SEARCH.page).catch(DEFAULT_TASK_SEARCH.page),
})

export type TaskSearchParams = z.infer<typeof TaskSearchParamsSchema>

export const toTaskListQuery = (search: TaskSearchParams): TaskListQuery => ({
  q: search.q,
  status: search.status,
  priority: search.priority,
  dueFrom: search.dueFrom,
  dueTo: search.dueTo,
  createdBy: search.createdBy,
  assigneeId: search.assigneeId,
  sort: search.sort,
  order: search.order,
  page: String(search.page),
})

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

export type TaskSearchFormValues = z.infer<typeof TaskSearchFormSchema>

// statusの空配列は「すべて」を表すため、デフォルト検索条件と区別してURLに保持する
// その他の空入力はundefinedに変換しURLのsearch paramsに合わせる
export const toTaskSearchParams = (form: TaskSearchFormValues, page = 1): TaskSearchParams => ({
  q: form.q || undefined,
  status: form.status,
  priority: form.priority.length > 0 ? form.priority : undefined,
  dueFrom: form.dueFrom ? new Date(form.dueFrom).toISOString() : undefined,
  dueTo: form.dueTo ? new Date(form.dueTo).toISOString() : undefined,
  createdBy: form.createdBy || undefined,
  assigneeId: form.assigneeId || undefined,
  sort: form.sort,
  order: form.order,
  page,
})

export const toTaskSearchFormValues = (search: TaskSearchParams): TaskSearchFormValues => ({
  q: search.q || '',
  status: search.status || [],
  priority: search.priority || [],
  dueFrom: toDateTimeLocal(search.dueFrom) || '',
  dueTo: toDateTimeLocal(search.dueTo) || '',
  createdBy: search.createdBy || '',
  assigneeId: search.assigneeId || '',
  sort: search.sort,
  order: search.order,
})

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

export type TaskCreateFormValues = z.infer<typeof TaskCreateFormSchema>

export const toTaskCreateRequestBody = (form: TaskCreateFormValues): TaskCreateRequestBody => ({
  title: form.title,
  description: form.description === '' ? null : form.description,
  priority: form.priority === '' ? null : form.priority,
  dueAt: form.dueAt === '' ? null : new Date(form.dueAt).toISOString(),
})

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

export type TaskUpdateFormValues = z.infer<typeof TaskUpdateFormSchema>

export const toTaskUpdateRequestBody = (form: TaskUpdateFormValues): TaskUpdateRequestBody => ({
  title: form.title,
  description: form.description === '' ? null : form.description,
  status: form.status,
  priority: form.priority === '' ? null : form.priority,
  dueAt: form.dueAt === '' ? null : new Date(form.dueAt).toISOString(),
})

export const TaskAssigneesFormSchema = z.object({
  assigneeIds: z.array(z.string()),
})

export type TaskAssigneesFormValues = z.infer<typeof TaskAssigneesFormSchema>

export const toTaskAssigneesUpdateRequestBody = (
  form: TaskAssigneesFormValues,
): TaskAssigneesUpdateRequestBody => ({
  userIds: form.assigneeIds,
})
