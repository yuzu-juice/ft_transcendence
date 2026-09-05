import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'
import type { TaskUpdateInput } from './schema'

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
}

export type Task = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
