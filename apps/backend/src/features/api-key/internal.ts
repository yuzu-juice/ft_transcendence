import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { AuthEnv } from '../../middleware/auth.js'
import { AppError } from '../../errors/app-error.js'
import { apiKeyService } from './service.js'
import { apiKeyIdParamSchema, createApiKeyBodySchema } from './schema.js'

const errorResponseSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .openapi('ErrorResponse')

const apiKeyResponseSchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    keyPrefix: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    key: z.string(),
  })
  .openapi('ApiKeyCreateResponse')

const apiKeyListItemSchema = z
  .object({
    id: z.uuid(),
    name: z.string(),
    keyPrefix: z.string(),
    lastUsedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .openapi('ApiKeySummary')

const createApiKeyRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createApiKeyBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Created API key',
      content: {
        'application/json': {
          schema: apiKeyResponseSchema,
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
      description: 'Authentication required',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const listApiKeysRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'API keys',
      content: {
        'application/json': {
          schema: z.array(apiKeyListItemSchema),
        },
      },
    },
    401: {
      description: 'Authentication required',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

const deleteApiKeyRoute = createRoute({
  method: 'delete',
  path: '/:apiKeyId',
  request: {
    params: apiKeyIdParamSchema,
  },
  responses: {
    204: {
      description: 'API key deleted',
    },
    401: {
      description: 'Authentication required',
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
      description: 'API key not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

export const apiKeys = new OpenAPIHono<AuthEnv>()

apiKeys.openapi(createApiKeyRoute, async (c) => {
  const { id: userId } = c.get('user')!
  const { name } = c.req.valid('json')

  const apiKey = await apiKeyService.create(userId, name)

  return c.json(apiKey, 201)
})

apiKeys.openapi(listApiKeysRoute, async (c) => {
  const { id: userId } = c.get('user')!

  const apiKeyList = await apiKeyService.listByUserId(userId)

  return c.json(apiKeyList, 200)
})

apiKeys.openapi(deleteApiKeyRoute, async (c) => {
  const { id: userId } = c.get('user')!
  const { apiKeyId } = c.req.valid('param')

  try {
    await apiKeyService.remove(apiKeyId, userId)
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw error
  }

  return c.body(null, 204)
})
