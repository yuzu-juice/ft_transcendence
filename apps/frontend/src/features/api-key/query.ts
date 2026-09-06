import { queryOptions } from '@tanstack/react-query'
import { apiKeyApi } from './api'

export const apiKeyQueryKeys = {
  all: () => ['api-keys'] as const,
  list: () => [...apiKeyQueryKeys.all(), 'list'] as const,
}

export const apiKeyQueries = {
  list: () =>
    queryOptions({
      queryKey: apiKeyQueryKeys.list(),
      queryFn: async () => apiKeyApi.list(),
      meta: {
        suppressErrorToast: true,
      },
    }),
}
