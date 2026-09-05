import { type InferRequestType, type InferResponseType, parseResponse } from 'hono/client'
import { client } from '@/lib/api/client'

type TaskListRequest = InferRequestType<typeof client.tasks.$get>
type TaskCreateRequest = InferRequestType<typeof client.tasks.$post>
type TaskUpdateRequest = InferRequestType<(typeof client.tasks)[':taskId']['$patch']>
type TaskAssigneesUpdateRequest = InferRequestType<
  (typeof client.tasks)[':taskId']['assignees']['$put']
>

export type TaskListQuery = TaskListRequest['query']
export type TaskCreateRequestBody = TaskCreateRequest['json']
export type TaskUpdateRequestBody = TaskUpdateRequest['json']
export type TaskAssigneesUpdateRequestBody = TaskAssigneesUpdateRequest['json']

export const userSearchApi = {
  list: () => parseResponse(client.users.$get({})),
}

export const taskApi = {
  list: (query: TaskListQuery) =>
    parseResponse(
      client.tasks.$get({
        query,
      }),
    ),

  detail: (taskId: string) =>
    parseResponse(
      client.tasks[':taskId'].$get({
        param: {
          taskId,
        },
      }),
    ),

  create: (json: TaskCreateRequestBody) =>
    parseResponse(
      client.tasks.$post({
        json,
      }),
    ),

  update: (taskId: string, json: TaskUpdateRequestBody) =>
    parseResponse(
      client.tasks[':taskId'].$patch({
        param: {
          taskId,
        },
        json,
      }),
    ),

  updateAssignees: (taskId: string, json: TaskAssigneesUpdateRequestBody) =>
    parseResponse(
      client.tasks[':taskId'].assignees.$put({
        param: {
          taskId,
        },
        json,
      }),
    ),

  delete: (taskId: string) =>
    parseResponse(
      client.tasks[':taskId'].$delete({
        param: {
          taskId,
        },
      }),
    ),
}

export type TaskListItem = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
export type TaskDetail = InferResponseType<(typeof client.tasks)[':taskId']['$get'], 200>
