// @ts-nocheck

import { taskApi } from '@/features/task/api'
import { TaskSearchParamsSchema, toTaskListQuery } from '@/features/task/schema'

const nullableString = (maxLength: number) => ({
  anyOf: [{ type: 'string', maxLength }, { type: 'null' }],
})

const nullablePriority = {
  anyOf: [
    {
      type: 'string',
      enum: ['low', 'medium', 'high'],
    },
    { type: 'null' },
  ],
}

const nullableDateTime = {
  anyOf: [
    {
      type: 'string',
      format: 'date-time',
    },
    { type: 'null' },
  ],
}

export async function registerTaskTools(signal: AbortSignal) {
  if (!document.modelContext) return

  await document.modelContext.registerTool(
    {
      name: 'search_tasks',
      title: 'タスクを検索',
      description:
        'Search tasks. Supports text search, status, priority, deadline, creator, assignee, sorting, and pagination.',
      // LLMから入力を受けるスキーマを定義する
      inputSchema: {
        type: 'object',
        properties: {
          q: {
            type: 'string',
            description: 'キーワード',
            maxLength: 200,
          },
          status: {
            type: 'array',
            description: 'タスクの状態',
            items: {
              enum: ['todo', 'in_progress', 'done'],
            },
          },
          priority: {
            type: 'array',
            description: 'タスクの優先度',
            items: {
              enum: ['low', 'medium', 'high'],
            },
          },
          dueFrom: {
            type: 'string',
            format: 'date-time',
            description: '締切期間の開始日時',
          },
          dueTo: {
            type: 'string',
            format: 'date-time',
            description: '締切期間の終了日時。dueFromより後の日時を指定。',
          },
          createdBy: {
            type: 'string',
            description: 'タスク作成者のアカウントID',
          },
          assigneeId: {
            type: 'string',
            description: 'タスク担当者のアカウントID',
          },
          sort: {
            type: 'string',
            description: 'タスクの並び変え基準',
            enum: ['createdAt', 'updatedAt', 'dueAt', 'status', 'priority'],
          },
          order: {
            type: 'string',
            description: 'タスクの並び順',
            enum: ['asc', 'desc'],
          },
          page: {
            type: 'integer',
            description: '表示するページ（1ページ20件）',
            minimum: 1,
          },
        },
        required: ['sort', 'order', 'page'],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true, // 読み取り専用の安全な操作であることを示す
      },
      async execute(input, { signal }) {
        return await taskApi.list(toTaskListQuery(input), signal)
      },
    },
    { signal },
  )

  await document.modelContext.registerTool(
    {
      name: 'get_task',
      title: 'タスクの詳細を取得',
      description: 'Retrieve details for the specified task.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            format: 'uuid',
            description: 'タスクID',
          },
        },
        required: ['taskId'],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
      },
      async execute({ taskId }, { signal }) {
        return await taskApi.detail(taskId, signal)
      },
    },
    { signal },
  )

  document.modelContext.registerTool(
    {
      name: 'create_task',
      title: 'タスクを作成',
      description:
        'Create a new task. title is required. description, priority, and dueAt are optional.',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'タスク名',
            minLength: 1,
            maxLength: 200,
          },
          description: {
            ...nullableString(2000),
            description: 'タスクの説明',
          },
          priority: {
            ...nullablePriority,
            description: 'タスクの優先度',
          },
          dueAt: {
            ...nullableDateTime,
            description: '締切日時',
          },
        },
        required: ['title'],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: false,
        untrustedContentHint: true,
      },
      async execute(input, { signal }) {
        return await taskApi.create(input, signal)
      },
    },
    { signal },
  ),
    await document.modelContext.registerTool(
      {
        name: 'update_task',
        title: 'タスクを編集',
        description:
          'Update the specified task. Only supplied fields are changed. null clears description, priority, or dueAt.',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: {
              type: 'string',
              format: 'uuid',
              description: '更新するタスクのID',
            },
            title: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              description: 'タスク名',
            },
            description: {
              ...nullableString(2000),
              description: 'タスクの説明。nullを指定すると説明を削除する。',
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              description: 'タスクの状態',
            },
            priority: {
              ...nullablePriority,
              description: 'タスクの優先度。nullを指定すると優先度を解除する。',
            },
            dueAt: {
              ...nullableDateTime,
              description: '締切日時。nullを指定すると締切を解除する。',
            },
          },
          required: ['taskId'],
          // taskId 以外に最低1つ変更項目が必要
          anyOf: [
            { required: ['title'] },
            { required: ['description'] },
            { required: ['status'] },
            { required: ['priority'] },
            { required: ['dueAt'] },
          ],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          untrustedContentHint: true,
        },
        async execute({ taskId, ...updates }, { signal }) {
          return await taskApi.update(taskId, updates, signal)
        },
      },
      { signal },
    )

  await document.modelContext.registerTool(
    {
      name: 'update_task_assignees',
      title: 'タスク担当者を更新',
      description:
        'Replace all assignees of the specified task. Passing an empty userIds array removes all assignees.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            format: 'uuid',
            description: '対象タスクのID',
          },
          userIds: {
            type: 'array',
            description: '新しい担当者のアカウントID一覧。現在の担当者一覧をこの配列で置き換える。',
            items: {
              type: 'string',
              minLength: 1,
            },
            uniqueItems: true,
          },
        },
        required: ['taskId', 'userIds'],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: false,
        untrustedContentHint: true,
      },
      async execute({ taskId, userIds }, { signal }) {
        return await taskApi.updateAssignees(taskId, { userIds }, signal)
      },
    },
    { signal },
  )
}
