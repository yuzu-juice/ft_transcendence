import { TaskPage } from '@/features/task/components/TaskPage'
import { DEFAULT_TASK_SEARCH, TaskSearchParamsSchema } from '@/features/task/schema'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tasks')({
  // Tanstack Routerの機能により、serach paramsをシリアライズする
  validateSearch: TaskSearchParamsSchema,
  // デフォルト値と同じ値を持つパラメータを自動的にURLから削除する
  search: {
    middlewares: [
      stripSearchParams({
        status: [...DEFAULT_TASK_SEARCH.status],
        sort: DEFAULT_TASK_SEARCH.sort,
        order: DEFAULT_TASK_SEARCH.order,
        page: DEFAULT_TASK_SEARCH.page,
      }),
    ],
  },
  component: TaskPage,
})
