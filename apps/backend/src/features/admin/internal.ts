import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { type AuthEnv, requireAdmin } from '../../middleware/auth.js'
import { validate } from '../../middleware/validator.js'
import {
  patchAdminUserSchema,
  patchUserRoleSchema,
  searchAdminUserSchema,
  userIdParamSchema,
} from './schema.js'
import { adminService } from './service.js'

export const admin = new Hono<AuthEnv>()

admin.use(requireAdmin)

admin.get('/users', validate('query', searchAdminUserSchema), async (c) => {
  const input = c.req.valid('query')

  const users = await adminService.search(input)

  return c.json(users)
})

admin.get('/users/:userId', validate('param', userIdParamSchema), async (c) => {
  const { userId } = c.req.valid('param')

  const user = await adminService.get(userId)

  return c.json(user)
})

admin.patch(
  '/users/:userId',
  validate('param', userIdParamSchema),
  validate('json', patchAdminUserSchema),
  async (c) => {
    const { userId } = c.req.valid('param')
    const { name } = c.req.valid('json')

    const user = await adminService.setName(userId, name, c.req.raw.headers)

    return c.json(user)
  },
)

admin.delete('/users/:userId', validate('param', userIdParamSchema), async (c) => {
  const { userId } = c.req.valid('param')
  const { id: executorId } = c.get('user')!
  const { AVATAR_DIR } = env<{ AVATAR_DIR: string }>(c)

  await adminService.remove(userId, executorId, AVATAR_DIR, c.req.raw.headers)

  return c.body(null, 204)
})

admin.patch(
  '/users/:userId/role',
  validate('param', userIdParamSchema),
  validate('json', patchUserRoleSchema),
  async (c) => {
    const { userId } = c.req.valid('param')
    const { role } = c.req.valid('json')
    const { id: executorId } = c.get('user')!

    const user = await adminService.setRole(userId, executorId, role, c.req.raw.headers)

    return c.json(user)
  },
)

export type InternalAdminAppType = typeof admin
