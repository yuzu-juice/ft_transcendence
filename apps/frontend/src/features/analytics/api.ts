import { type InferRequestType, type InferResponseType, parseResponse } from 'hono/client'
import { client } from '@/lib/api/client'

type AnalyticsSummaryRequest = InferRequestType<typeof client.analytics.summary.$get>
export type AnalyticsSummaryQuery = AnalyticsSummaryRequest['query']

export const analyticsApi = {
  summary: (query: AnalyticsSummaryQuery) =>
    parseResponse(client.analytics.summary.$get({ query })),
}

export type AnalyticsSummary = InferResponseType<typeof client.analytics.summary.$get, 200>
