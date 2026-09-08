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
  list: (query: TaskListQuery, signal?: AbortSignal) =>
    parseResponse(client.tasks.$get({ query }, { init: { signal } })),

  detail: (taskId: string, signal?: AbortSignal) =>
    parseResponse(
      client.tasks[':taskId'].$get(
        {
          param: { taskId },
        },
        { init: { signal } },
      ),
    ),

  create: (json: TaskCreateRequestBody, signal?: AbortSignal) =>
    parseResponse(client.tasks.$post({ json }, { init: { signal } })),

  update: (taskId: string, json: TaskUpdateRequestBody, signal?: AbortSignal) =>
    parseResponse(
      client.tasks[':taskId'].$patch(
        {
          param: { taskId },
          json,
        },
        { init: { signal } },
      ),
    ),

  updateAssignees: (taskId: string, json: TaskAssigneesUpdateRequestBody, signal?: AbortSignal) =>
    parseResponse(
      client.tasks[':taskId'].assignees.$put(
        {
          param: { taskId },
          json,
        },
        { init: { signal } },
      ),
    ),

  delete: (taskId: string, signal?: AbortSignal) =>
    parseResponse(
      client.tasks[':taskId'].$delete(
        {
          param: { taskId },
        },
        { init: { signal } },
      ),
    ),
}

export type TaskListItem = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
export type TaskDetail = InferResponseType<(typeof client.tasks)[':taskId']['$get'], 200>
