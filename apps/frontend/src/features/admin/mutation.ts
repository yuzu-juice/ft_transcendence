import { queryClient } from '@/lib/query/client'
import { mutationOptions } from '@tanstack/react-query'
import { adminApi } from './api'
import { adminQueryKeys } from './query'

export const adminMutations = {
  delete: () =>
    mutationOptions({
      mutationKey: ['admin', 'user', 'delete'],
      mutationFn: async (userId: string) => {
        await adminApi.delete(userId)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: adminQueryKeys.all(),
        })
      },
    }),
}
