import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { ApiKeyAuthEnv } from '../../middleware/api-key-auth.js'
import {
  createTaskSchema,
  listTaskSchema,
  publicTaskSchema,
  publicTaskPageSchema,
  patchTaskSchema,
  taskIdParamSchema,
} from './public_schema.js'
import { taskService } from './service.js'

const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .openapi('PublicTaskErrorResponse')

const listTasksRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: listTaskSchema,
  },
  responses: {
    200: {
      description: 'Task list',
      content: {
        'application/json': {
          schema: publicTaskPageSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'API key required or invalid',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const createTaskRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createTaskSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Created task',
      content: {
        'application/json': {
          schema: publicTaskSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'API key required or invalid',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const getTaskRoute = createRoute({
  method: 'get',
  path: '/{taskId}',
  request: {
    params: taskIdParamSchema,
  },
  responses: {
    200: {
      description: 'Task detail',
      content: {
        'application/json': {
          schema: publicTaskSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'API key required or invalid',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: 'Task not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const patchTaskRoute = createRoute({
  method: 'patch',
  path: '/{taskId}',
  request: {
    params: taskIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: patchTaskSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Updated task',
      content: {
        'application/json': {
          schema: publicTaskSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'API key required or invalid',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: 'Task not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const deleteTaskRoute = createRoute({
  method: 'delete',
  path: '/{taskId}',
  request: {
    params: taskIdParamSchema,
  },
  responses: {
    204: {
      description: 'Task deleted',
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'API key required or invalid',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: 'Task not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

export const publicTasks = new OpenAPIHono<ApiKeyAuthEnv>()

publicTasks.openapi(listTasksRoute, async (c) => {
  const { page } = c.req.valid('query')

  const result = await taskService.search({
    page,
    sort: 'createdAt',
    order: 'desc',
  })

  return c.json(result.data, 200)
})

publicTasks.openapi(createTaskRoute, async (c) => {
  const { userId } = c.get('apiKey')!
  const { title, description, priority, dueAt } = c.req.valid('json')

  const task = await taskService.create({
    title,
    description: description ?? null,
    priority: priority ?? null,
    createdBy: userId,
    dueAt: dueAt ?? null,
  })

  if (!task) {
    return c.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create task' } } as never,
      500,
    )
  }

  return c.json(task, 201)
})

publicTasks.openapi(getTaskRoute, async (c) => {
  const { taskId } = c.req.valid('param')

  const task = await taskService.get(taskId)

  return c.json(task, 200)
})

publicTasks.openapi(patchTaskRoute, async (c) => {
  const { taskId } = c.req.valid('param')
  const body = c.req.valid('json')
  const input = Object.fromEntries(Object.entries(body).filter(([_, value]) => value !== undefined))

  const task = await taskService.update(taskId, input)

  return c.json(task, 200)
})

// Public APIでは、isAdmin = false固定　APIキーの持ち主＝タスクの作成者だけが削除可能とする。
// APIキーの持ち主が、自分の作成したタスクを削除する → できる
// APIキーの持ち主が、他人の作成したタスクを削除しようとする → 403エラーで拒否（adminという抜け道が無いので）
publicTasks.openapi(deleteTaskRoute, async (c) => {
  const { taskId } = c.req.valid('param')
  const { userId } = c.get('apiKey')!

  await taskService.delete(taskId, userId, false)

  return c.body(null, 204)
})
