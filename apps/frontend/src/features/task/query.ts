import { queryOptions } from '@tanstack/react-query'
import { taskApi, userSearchApi } from './api'
import type { TaskSearchParamsInput } from './schema'

export const taskQueryKeys = {
  all: () => ['tasks'] as const,
  list: (search: TaskSearchParamsInput) => [...taskQueryKeys.all(), 'list', search],
  detail: (taskId: string) => [...taskQueryKeys.all(), 'detail', taskId],
}

export const taskQueries = {
  list: (search: TaskSearchParamsInput) =>
    queryOptions({
      queryKey: taskQueryKeys.list(search),
      queryFn: async () => taskApi.list(search),
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

export const userSearchQueries = {
  list: () =>
    queryOptions({
      queryKey: ['user', 'search'],
      queryFn: async () => userSearchApi.list(),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
