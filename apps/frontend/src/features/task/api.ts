import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'
import type { TaskAssigneesUpdateInput, TaskUpdateInput } from './schema'

export const userSearchApi = {
  list: () => parseResponse(client.users.$get({})),
}

export const taskApi = {
  list: () => parseResponse(client.tasks.$get({ query: {} })),

  detail: (taskId: string) =>
    parseResponse(
      client.tasks[':taskId'].$get({
        param: {
          taskId,
        },
      }),
    ),

  update: (taskId: string, { title, description, status, priority, dueAt }: TaskUpdateInput) =>
    parseResponse(
      client.tasks[':taskId'].$patch({
        param: {
          taskId,
        },
        json: {
          title,
          description,
          status,
          priority,
          dueAt,
        },
      }),
    ),

  updateAssignees: (taskId: string, { assigneeIds }: TaskAssigneesUpdateInput) =>
    parseResponse(
      client.tasks[':taskId'].assignees.$put({
        param: {
          taskId,
        },
        json: {
          userIds: assigneeIds,
        },
      }),
    ),
}

export type Task = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
