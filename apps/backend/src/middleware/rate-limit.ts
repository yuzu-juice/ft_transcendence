// middleware/rate-limit.ts
import { rateLimiter } from 'hono-rate-limiter'
import type { ApiKeyAuthEnv } from './api-key-auth.js'

export const apiKeyRateLimiter = rateLimiter<ApiKeyAuthEnv>({
  windowMs: 60 * 1000,
  limit: 30,
  keyGenerator: (c) => c.get('apiKey').id,
})
