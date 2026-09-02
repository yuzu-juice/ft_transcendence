import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'

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
}

export type Task = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
