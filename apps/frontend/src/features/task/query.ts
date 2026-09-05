import { queryOptions } from '@tanstack/react-query'
import { taskApi, userSearchApi } from './api'
import { type TaskSearchParams, toTaskListQuery } from './schema'

export const taskQueryKeys = {
  all: () => ['tasks'] as const,
  list: (search?: TaskSearchParams) => [...taskQueryKeys.all(), 'list', search],
  detail: (taskId: string) => [...taskQueryKeys.all(), 'detail', taskId],
}

export const taskQueries = {
  list: (search: TaskSearchParams) =>
    queryOptions({
      queryKey: taskQueryKeys.list(search),
      queryFn: async () => taskApi.list(toTaskListQuery(search)),
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

export const userSearchQueryKeys = {
  all: () => ['user'] as const,
  list: () => [...userSearchQueryKeys.all(), 'search'],
}

export const userSearchQueries = {
  list: () =>
    queryOptions({
      queryKey: userSearchQueryKeys.list(),
      queryFn: async () => userSearchApi.list(),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
