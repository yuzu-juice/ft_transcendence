import { client } from '@/lib/api/client'
import { parseResponse } from 'hono/client'

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
