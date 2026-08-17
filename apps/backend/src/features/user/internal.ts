import { Hono } from 'hono'
import { env } from 'hono/adapter'

import { userService } from './service.js'

import type { AuthEnv } from '../../middleware/auth.js'
import { validate } from '../../middleware/validator.js'
import { patchMeSchema } from './schema.js'
import { bodyLimit } from 'hono/body-limit'
import { avatarService } from '../avatar/service.js'

const MAX_AVATAR_SIZE = 4 * 1024 * 1024

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

me.put(
  '/avatar',
  bodyLimit({
    maxSize: 5 * 1024 * 1024,
    onError: (c) => {
      return c.json(
        {
          error: {
            code: 'AVATAR_TOO_LARGE',
            message: 'Avatar file is too large',
          },
        },
        413,
      )
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()

    const file = body.avatar

    if (!(file instanceof File)) {
      return c.json(
        {
          error: {
            code: 'INVALID_AVATAR',
            message: 'Avatar file is required',
          },
        },
        400,
      )
    }

    if (file.size > MAX_AVATAR_SIZE) {
      return c.json(
        {
          error: {
            code: 'AVATAR_TOO_LARGE',
            message: 'Avatar must be 4 MiB or smaller',
          },
        },
        413,
      )
    }

    const { id } = c.get('user')!

    const { AVATAR_DIR } = env<{ AVATAR_DIR: string }>(c)

    const input = new Uint8Array(await file.arrayBuffer())

    const image = await avatarService.update(id, input, AVATAR_DIR)

    return c.json({
      image,
    })
  },
)

me.delete('/avatar', async (c) => {
  const { id } = c.get('user')!
  const { AVATAR_DIR } = env<{ AVATAR_DIR: string }>(c)

  await avatarService.remove(id, AVATAR_DIR)

  return c.body(null, 204)
})

export type InternalMeAppType = typeof me

export const users = new Hono<AuthEnv>()

users.get('/', async (c) => {
  const result = await userService.list()
  return c.json(result)
})

export type InternalUserAppType = typeof users
