import { Hono } from 'hono'
import type { AuthEnv } from '../../middleware/auth.js'
import { taskService } from './service.js'

export const analytics = new Hono<AuthEnv>().get('/summary', async (c) => {
  const result = await taskService.getAnalyticsSummary()
  return c.json(result)
})

export type InternalAnalyticsAppType = typeof analytics
