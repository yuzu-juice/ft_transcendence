import { Hono } from 'hono'
import type { AuthEnv } from '../../middleware/auth.js'
import { validate } from '../../middleware/validator.js'
import { getAnalyticsSummarySchema } from './schema.js'
import { taskService } from './service.js'

export const analytics = new Hono<AuthEnv>().get(
  '/summary',
  validate('query', getAnalyticsSummarySchema),
  async (c) => {
    const input = c.req.valid('query')
    const result = await taskService.getAnalyticsSummary(input)
    return c.json(result)
  },
)

export type InternalAnalyticsAppType = typeof analytics
