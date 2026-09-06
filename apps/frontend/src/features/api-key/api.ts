import { type InferRequestType, type InferResponseType, parseResponse } from 'hono/client'
import { client } from '@/lib/api/client'

type ApiKeyCreateRequest = InferRequestType<(typeof client)['api-keys']['$post']>

export type ApiKeyCreateRequestBody = ApiKeyCreateRequest['json']

export const apiKeyApi = {
  list: () => parseResponse(client['api-keys'].$get()),

  create: (json: ApiKeyCreateRequestBody) =>
    parseResponse(
      client['api-keys'].$post({
        json,
      }),
    ),

  delete: (apiKeyId: string) =>
    parseResponse(
      client['api-keys'][':apiKeyId'].$delete({
        param: {
          apiKeyId,
        },
      }),
    ),
}

export type ApiKeySummary = InferResponseType<(typeof client)['api-keys']['$get'], 200>[number]
export type ApiKeyCreateResponse = InferResponseType<(typeof client)['api-keys']['$post'], 201>
