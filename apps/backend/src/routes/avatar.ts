import { Hono } from 'hono'
import { validate } from '../middleware/validator.js'
import { avatarKeyParamSchema } from '../features/avatar/schema.js'
import { readAvatar } from '../features/avatar/storage.js'
import { env } from 'hono/adapter'

const avatar = new Hono()

avatar.get('/:avatarKey', validate('param', avatarKeyParamSchema), async (c) => {
  const { avatarKey } = c.req.valid('param')
  const { AVATAR_DIR } = env<{ AVATAR_DIR: string }>(c)

  const image = await readAvatar(avatarKey, AVATAR_DIR)

  if (image === null) {
    return c.json(
      {
        error: {
          code: 'AVATAR_NOT_FOUND',
          message: 'Avatar not found',
        },
      },
      404,
    )
  }

  const body = new Uint8Array(image)

  return c.body(body, 200, {
    'Content-Type': 'image/webp',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  })
})

export default avatar
