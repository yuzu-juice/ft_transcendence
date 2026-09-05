import { queryClient } from '@/lib/query/client'
import { mutationOptions } from '@tanstack/react-query'
import { taskQueryKeys } from './query'
import { taskApi } from './api'
import type { TaskAssigneesUpdateInput, TaskUpdateInput } from './schema'

export const taskMutations = {
  update: () =>
    mutationOptions({
      mutationKey: ['task', 'update', 'info'],
      mutationFn: async (variables: { taskId: string; input: TaskUpdateInput }) => {
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
      mutationFn: async (variables: { taskId: string; input: TaskAssigneesUpdateInput }) => {
        await taskApi.updateAssignees(variables.taskId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
      },
    }),
}
