import { z } from '@hono/zod-openapi'
import { taskPriorityEnum, taskStatusEnum } from '../../db/schema/tasks.js'

// db/schema/tasks.tsで定義されている
// export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'done'])
// export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high'])
// これらは、drizzle-orm の pgEnum から取得されるため、Zodのenumとして再定義。
const statusSchema = z.enum(taskStatusEnum.enumValues)
const prioritySchema = z.enum(taskPriorityEnum.enumValues)

// GET /api/tasks 用（単純な一覧取得）

// z.coerce.number() クエリパラメータは文字列（?page=2の"2"）で来るが数値として扱う
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

// 新規作成時は常にDB側のデフォルト'todo'から始まる設計なので、statusは不要
// priorityは任意で、nullを許容する設計
export const createTaskSchema = z
  .object({
    title: z.string().min(1).max(200).openapi({ example: '買い物に行く' }),
    description: z.string().max(2000).nullable().optional().openapi({ example: '牛乳と卵を買う' }),
    priority: prioritySchema.nullable().optional().openapi({ example: 'medium' }),
    dueAt: z.coerce.date().nullable().optional().openapi({ example: '2026-09-10T00:00:00Z' }),
  })
  .openapi('CreateTaskInput')

export type CreateTaskInput = z.infer<typeof createTaskSchema>

// GET /:taskId、PATCH /:taskId、DELETE /:taskIdの3つ全部で共通して使う
// URLの中に埋め込まれるtaskIdが、正しいUUID形式かをチェックするスキーマ
export const taskIdParamSchema = z.object({
  taskId: z.uuid().openapi({
    param: { name: 'taskId', in: 'path' },
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),
})

export type TaskIdParamInput = z.infer<typeof taskIdParamSchema>

// PATCH /api/tasks/:taskId 用（部分更新）
// 全フィールドが.optional()（＝部分更新）
// .refine(...)は、Zodの標準の型チェックだけでは表現できない、追加のカスタムルールを付け足す仕組み
// ここでは「送られてきたデータの中に、1つでもundefinedじゃない値がある」ことをチェック
// もし何も送らずに空のリクエストを送ると、「最低1項目は入力してください」という意味のメッセージが返る。
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

// ユーザー情報の簡易版（id・name・imageだけ）
// creatorやassigneesとしてpublicTaskSchemaの中で使う
const publicUserSummarySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable(),
  })
  .openapi('UserSummary')

// レスポンス用
// 1件のタスクをクライアントに返すときの形。
// ユーザ情報まで返すのはセキュリティ的には問題かもしれないが
// 削るほうが面倒なので、いったんcreator・assigneesも含めた形にしている。
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

// 複数のタスクを配列として返す一覧用の形
export const publicTaskPageSchema = z.array(publicTaskSchema).openapi('TaskPage')
