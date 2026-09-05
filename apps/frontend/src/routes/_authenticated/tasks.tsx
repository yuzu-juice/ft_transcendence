import { TaskPage } from '@/features/task/components/TaskPage'
import { TaskSearchParamsSchema } from '@/features/task/schema'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tasks')({
  // Tanstack Routerの機能により、serach paramsをシリアライズする
  validateSearch: TaskSearchParamsSchema,
  // デフォルト値と同じ値を持つパラメータを自動的にURLから削除する
  search: {
    middlewares: [
      stripSearchParams({
        status: ['todo', 'in_progress'],
        sort: 'dueAt',
        order: 'asc',
        page: 1,
      }),
    ],
  },
  component: TaskPage,
})
