import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { ApiKeyAuthEnv } from '../../middleware/api-key-auth.js'
import { createTaskSchema, searchTaskSchema, taskIdParamSchema } from './schema.js'
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

const publicTaskSchema = z.any().openapi('PublicTask')
const publicTaskPageSchema = z.any().openapi('PublicTaskPage')

const searchTasksRoute = createRoute({
  method: 'get',
  path: '/',
  request: {
    query: searchTaskSchema,
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
  },
})

const getTaskRoute = createRoute({
  method: 'get',
  path: '/:taskId',
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

const putTaskRoute = createRoute({
  method: 'put',
  path: '/:taskId',
  request: {
    params: taskIdParamSchema,
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
  path: '/:taskId',
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

publicTasks.openapi(searchTasksRoute, async (c) => {
  const input = c.req.valid('query')

  const tasks = await taskService.search(input)

  return c.json(tasks, 200)
})

publicTasks.openapi(createTaskRoute, async (c) => {
  const { id } = c.get('user')
  const { title, description, priority, dueAt } = c.req.valid('json')

  const task = await taskService.create({
    title,
    description: description ?? null,
    priority: priority ?? null,
    createdBy: id,
    dueAt: dueAt ?? null,
  })

  return c.json(task, 201)
})

publicTasks.openapi(getTaskRoute, async (c) => {
  const { taskId } = c.req.valid('param')

  const task = await taskService.get(taskId)

  return c.json(task, 200)
})

publicTasks.openapi(putTaskRoute, async (c) => {
  const { taskId } = c.req.valid('param')
  const { title, description, priority, dueAt } = c.req.valid('json')

  const task = await taskService.update(taskId, {
    title,
    description: description ?? null,
    priority: priority ?? null,
    dueAt: dueAt ?? null,
  })

  return c.json(task, 200)
})

publicTasks.openapi(deleteTaskRoute, async (c) => {
  const { taskId } = c.req.valid('param')
  const { id: userId, role } = c.get('user')

  await taskService.delete(taskId, userId, role === 'admin')

  return c.body(null, 204)
})
