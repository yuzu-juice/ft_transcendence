import { queryOptions } from '@tanstack/react-query'
import { analyticsApi } from './api'

const analyticsQueryKeys = {
  all: () => ['analytics'] as const,

  summary: () => [...analyticsQueryKeys.all(), 'summary'] as const,
}

export const analyticsQueries = {
  summary: () =>
    queryOptions({
      queryKey: analyticsQueryKeys.summary(),
      queryFn: async () => analyticsApi.summary(),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
