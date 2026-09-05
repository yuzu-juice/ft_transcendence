import { queryOptions } from '@tanstack/react-query'
import { taskApi } from './api'

export const taskQueryKeys = {
  all: () => ['tasks'] as const,

  list: () => [...taskQueryKeys.all(), 'list'],

  detail: (taskId: string) => [...taskQueryKeys.all(), 'detail', taskId],
  // TODO: 検索パラメータを明示的にkeyに持つように実装する
}

// TODO: 検索UI実装までの一時的なもの
export const taskQueries = {
  list: () =>
    queryOptions({
      queryKey: taskQueryKeys.list(),
      queryFn: async () => taskApi.list(),
      meta: {
        suppressErrorToast: true,
      },
    }),

  detail: (taskId: string) =>
    queryOptions({
      queryKey: taskQueryKeys.detail(taskId),
      queryFn: async () => taskApi.detail(taskId),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
