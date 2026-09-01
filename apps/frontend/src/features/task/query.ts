import { queryOptions } from '@tanstack/react-query'
import { taskApi } from './api'

const taskQueryKeys = {
  all: () => ['tasks'] as const,

  get: (taskId: string) => [...taskQueryKeys.all(), taskId],
  // TODO: 検索パラメータを明示的にkeyに持つように実装する
}

// TODO: 検索UI実装までの一時的なもの
export const taskQueries = {
  all: () =>
    queryOptions({
      queryKey: taskQueryKeys.all(),
      queryFn: async () => taskApi.all(),
      meta: {
        suppressErrorToast: true,
      },
    }),

  get: (taskId: string) =>
    queryOptions({
      queryKey: taskQueryKeys.get(taskId),
      queryFn: async () => taskApi.get(taskId),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
