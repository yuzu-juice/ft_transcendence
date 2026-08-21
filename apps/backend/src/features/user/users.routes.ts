import { Hono } from 'hono'

import type { AuthEnv } from '../../middleware/auth.js'
import { userService } from './service.js'

export const users = new Hono<AuthEnv>()

users.get('/', async (c) => {
  const result = await userService.list()
  return c.json(result)
})

export type InternalUserAppType = typeof users
