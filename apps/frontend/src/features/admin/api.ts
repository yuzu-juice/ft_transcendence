import { type InferRequestType, type InferResponseType, parseResponse } from 'hono/client'
import { client } from '@/lib/api/client'

type AdminUserUpdateRequest = InferRequestType<(typeof client.admin.users)[':userId']['$patch']>
type AdminUserRoleUpdateRequest = InferRequestType<
  (typeof client.admin.users)[':userId']['role']['$patch']
>

export type AdminUserUpdateRequestBody = AdminUserUpdateRequest['json']
export type AdminUserRoleUpdateRequestBody = AdminUserRoleUpdateRequest['json']

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

  update: (userId: string, json: AdminUserUpdateRequestBody) =>
    parseResponse(
      client.admin.users[':userId'].$patch({
        param: {
          userId,
        },
        json,
      }),
    ),

  updateRole: (userId: string, json: AdminUserRoleUpdateRequestBody) =>
    parseResponse(
      client.admin.users[':userId'].role.$patch({
        param: {
          userId,
        },
        json,
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

export type AdminUserSummary = InferResponseType<typeof client.admin.users.$get, 200>[number]
export type AdminUserDetail = InferResponseType<(typeof client.admin.users)[':userId']['$get'], 200>
