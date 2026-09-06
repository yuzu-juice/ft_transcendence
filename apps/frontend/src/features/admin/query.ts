import { queryOptions } from '@tanstack/react-query'
import { adminApi } from './api'

export const adminQueryKeys = {
  all: () => ['admin'] as const,
  users: () => [...adminQueryKeys.all(), 'users'],
  detail: (userId: string) => [...adminQueryKeys.all(), 'detail', userId],
}

export const adminQueries = {
  users: () =>
    queryOptions({
      queryKey: adminQueryKeys.users(),
      queryFn: async () => adminApi.users(),
      meta: {
        suppressErrorToast: true,
      },
    }),

  detail: (userId: string) =>
    queryOptions({
      queryKey: adminQueryKeys.detail(userId),
      queryFn: async () => adminApi.detail(userId),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
