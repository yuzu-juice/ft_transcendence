import { mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/lib/query/client'
import {
  type TaskAssigneesUpdateRequestBody,
  type TaskCreateRequestBody,
  type TaskUpdateRequestBody,
  taskApi,
} from './api'
import { taskQueryKeys } from './query'

export const taskMutations = {
  create: () =>
    mutationOptions({
      mutationKey: ['task', 'create'],
      mutationFn: async (input: TaskCreateRequestBody) => {
        await taskApi.create(input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
      },
    }),

  update: () =>
    mutationOptions({
      mutationKey: ['task', 'update', 'info'],
      mutationFn: async (variables: { taskId: string; input: TaskUpdateRequestBody }) => {
        await taskApi.update(variables.taskId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
      },
    }),

  updateAssignees: () =>
    mutationOptions({
      mutationKey: ['task', 'update', 'assignees'],
      mutationFn: async (variables: { taskId: string; input: TaskAssigneesUpdateRequestBody }) => {
        await taskApi.updateAssignees(variables.taskId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
      },
    }),

  delete: () =>
    mutationOptions({
      mutationKey: ['task', 'delete'],
      mutationFn: async (taskId: string) => {
        await taskApi.delete(taskId)
      },
      onSuccess: async (_data, taskId) => {
        queryClient.removeQueries({
          queryKey: taskQueryKeys.detail(taskId),
          exact: true,
        })

        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.list(),
        })
      },
    }),
}
