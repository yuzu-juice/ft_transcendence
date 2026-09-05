import { queryClient } from '@/lib/query/client'
import { mutationOptions } from '@tanstack/react-query'
import { taskQueryKeys } from './query'
import { taskApi } from './api'
import type { TaskUpdateInput } from './schema'

export const taskMutations = {
  update: () =>
    mutationOptions({
      mutationKey: ['task', 'update'],
      mutationFn: async (variables: { taskId: string; input: TaskUpdateInput }) => {
        await taskApi.update(variables.taskId, variables.input)
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: taskQueryKeys.all(),
        })
      },
    }),
}
