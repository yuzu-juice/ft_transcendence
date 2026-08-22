import { z } from '@hono/zod-openapi'

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100).openapi({
    example: 'CI token',
    description: 'Display name for the API key',
  }),
})

export const createApiKeyBodySchema = createApiKeySchema.openapi('CreateApiKeyRequest')

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>

export const apiKeyIdParamSchema = z.object({
  apiKeyId: z.uuid().openapi({
    param: {
      name: 'apiKeyId',
      in: 'path',
    },
    example: '550e8400-e29b-41d4-a716-446655440000',
  }),
})

export type ApiKeyIdParamInput = z.infer<typeof apiKeyIdParamSchema>
