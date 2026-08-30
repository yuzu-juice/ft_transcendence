import { queryOptions } from '@tanstack/react-query'
import { taskApi } from './api'

const taskQueryKeys = {
  all: () => ['tasks'] as const,
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
}
