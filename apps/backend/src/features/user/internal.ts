import { Hono } from 'hono'
import { userService } from './service.js'

import type { AuthEnv } from '../../middleware/auth.js'
import { validate } from '../../middleware/validator.js'
import { patchMeSchema } from './schema.js'

export const me = new Hono<AuthEnv>()

me.get('/', async (c) => {
  const user = c.get('user')!

  const result = await userService.get(user.id)

  return c.json(result)
})

me.patch('/', validate('json', patchMeSchema), async (c) => {
  const user = c.get('user')!
  const { name } = c.req.valid('json')

  const result = await userService.update(user.id, name)

  return c.json(result)
})

export type InternalMeAppType = typeof me
