import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'
import type {
  TaskAssigneesUpdateInput,
  TaskCreateInput,
  TaskSearchParamsInput,
  TaskUpdateInput,
} from './schema'

export const userSearchApi = {
  list: () => parseResponse(client.users.$get({})),
}

export const taskApi = {
  list: (search: TaskSearchParamsInput) =>
    parseResponse(
      client.tasks.$get({
        query: {
          q: search.q,
          status: search.status,
          priority: search.priority,
          dueFrom: search.dueFrom,
          dueTo: search.dueTo,
          createdBy: search.createdBy,
          assigneeId: search.assigneeId,
          sort: search.sort,
          order: search.order,
          page: String(search.page),
        },
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

  create: ({ title, description, priority, dueAt }: TaskCreateInput) =>
    parseResponse(
      client.tasks.$post({
        json: {
          title,
          description,
          priority,
          dueAt,
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

  delete: (taskId: string) =>
    parseResponse(
      client.tasks[':taskId'].$delete({
        param: {
          taskId,
        },
      }),
    ),
}

export type Task = InferResponseType<typeof client.tasks.$get, 200>['data'][number]
