import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'
import type { AdminUserUpdateInput, AdminUserUpdateRoleInput } from './schema'

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

  update: (userId: string, { name }: AdminUserUpdateInput) =>
    parseResponse(
      client.admin.users[':userId'].$patch({
        param: {
          userId,
        },
        json: {
          name,
        },
      }),
    ),

  updateRole: (userId: string, { role }: AdminUserUpdateRoleInput) =>
    parseResponse(
      client.admin.users[':userId'].role.$patch({
        param: {
          userId,
        },
        json: {
          role,
        },
      }),
    ),

  delete: (userId: string) =>
    parseResponse(
      client.admin.users[':userId'].$delete({
        param: {
          userId,
        },
      }),
    ),
}

export type User = InferResponseType<typeof client.admin.users.$get, 200>[number]
