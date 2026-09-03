import { client } from '@/lib/api/client'
import { parseResponse, type InferResponseType } from 'hono/client'

export const analyticsApi = {
  summary: () => parseResponse(client.analytics.summary.$get()),
}

export type AnalyticsSummary = InferResponseType<typeof client.analytics.summary.$get, 200>
