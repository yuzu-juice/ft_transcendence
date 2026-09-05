import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'

export const adminApi = {
  // TODO: ユーザ名・ロールによるフィルタリングを実装する
  users: () =>
    parseResponse(
      client.admin.users.$get({
        query: {},
      }),
    ),

  detail: (userId: string) =>
    parseResponse(
      client.admin.users[':userId'].$get({
        param: {
          userId,
        },
      }),
    ),
}

export type User = InferResponseType<typeof client.admin.users.$get, 200>[number]
