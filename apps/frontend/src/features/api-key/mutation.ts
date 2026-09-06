import { mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/lib/query/client'
import { type ApiKeyCreateRequestBody, apiKeyApi } from './api'
import { apiKeyQueryKeys } from './query'

export const apiKeyMutations = {
  create: () =>
    mutationOptions({
      mutationKey: ['api-keys', 'create'],
      mutationFn: async (input: ApiKeyCreateRequestBody) => apiKeyApi.create(input),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: apiKeyQueryKeys.all(),
        })
      },
      meta: {
        suppressErrorToast: true,
      },
    }),

  delete: () =>
    mutationOptions({
      mutationKey: ['api-keys', 'delete'],
      mutationFn: async (apiKeyId: string) => {
        await apiKeyApi.delete(apiKeyId)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: apiKeyQueryKeys.all(),
        })
      },
      meta: {
        suppressErrorToast: true,
      },
    }),
}
