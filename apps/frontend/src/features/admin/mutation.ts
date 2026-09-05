import { queryClient } from '@/lib/query/client'
import { mutationOptions } from '@tanstack/react-query'
import { adminApi } from './api'
import { adminQueryKeys } from './query'
import type { AdminUserUpdateInput, AdminUserUpdateRoleInput } from './schema'

export const adminMutations = {
  update: () =>
    mutationOptions({
      mutationKey: ['admin', 'user', 'update', 'info'],
      mutationFn: async (variables: { userId: string; input: AdminUserUpdateInput }) => {
        await adminApi.update(variables.userId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: adminQueryKeys.all(),
        })
      },
    }),

  updateRole: () =>
    mutationOptions({
      mutationKey: ['admin', 'user', 'update', 'role'],
      mutationFn: async (variables: { userId: string; input: AdminUserUpdateRoleInput }) => {
        await adminApi.updateRole(variables.userId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: adminQueryKeys.all(),
        })
      },
    }),

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
