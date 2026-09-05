import { mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/lib/query/client'
import { taskQueryKeys, userSearchQueryKeys } from '../task/query'
import {
  type AdminUserRoleUpdateRequestBody,
  type AdminUserUpdateRequestBody,
  adminApi,
} from './api'
import { adminQueryKeys } from './query'

export const adminMutations = {
  update: () =>
    mutationOptions({
      mutationKey: ['admin', 'user', 'update', 'info'],
      mutationFn: async (variables: { userId: string; input: AdminUserUpdateRequestBody }) => {
        await adminApi.update(variables.userId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: adminQueryKeys.all(),
        })
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
        await queryClient.invalidateQueries({
          queryKey: ['user', 'search'],
        })
      },
    }),

  updateRole: () =>
    mutationOptions({
      mutationKey: ['admin', 'user', 'update', 'role'],
      mutationFn: async (variables: { userId: string; input: AdminUserRoleUpdateRequestBody }) => {
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
      onSuccess: async (_, userId) => {
        queryClient.removeQueries({
          queryKey: adminQueryKeys.detail(userId),
          exact: true,
        })
        await queryClient.invalidateQueries({
          queryKey: adminQueryKeys.users(),
        })
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
        await queryClient.invalidateQueries({
          queryKey: userSearchQueryKeys.list(),
        })
      },
    }),
}
