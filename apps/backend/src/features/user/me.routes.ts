import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { env } from '../../config/env.js'

import type { AuthEnv } from '../../middleware/auth.js'
import { validate } from '../../middleware/validator.js'
import { avatarService } from '../avatar/service.js'
import { patchMeSchema } from './schema.js'
import { userService } from './service.js'

const MAX_AVATAR_SIZE = 4 * 1024 * 1024

export const me = new Hono<AuthEnv>()
  .get('/', async (c) => {
    const user = c.get('user')

    const result = await userService.get(user.id)

    return c.json(result)
  })
  .patch('/', validate('json', patchMeSchema), async (c) => {
    const user = c.get('user')
    const { name } = c.req.valid('json')

    const result = await userService.update(user.id, name)

    return c.json(result)
  })
  .put(
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

      const { id } = c.get('user')

      const input = new Uint8Array(await file.arrayBuffer())

      const image = await avatarService.update(id, input, env.AVATAR_DIR)

      return c.json({
        image,
      })
    },
  )
  .delete('/avatar', async (c) => {
    const { id } = c.get('user')

    await avatarService.remove(id, env.AVATAR_DIR)

    return c.body(null, 204)
  })

export type InternalMeAppType = typeof me
