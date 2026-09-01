import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'

export const taskApi = {
  all: () => parseResponse(client.tasks.$get({ query: {} })),

  get: (taskId: string) =>
    parseResponse(
      client.tasks[':taskId'].$get({
        param: {
          taskId,
        },
      }),
    ),
}

export type Task = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
