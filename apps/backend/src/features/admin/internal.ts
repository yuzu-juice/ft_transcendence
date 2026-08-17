import { Hono } from 'hono'

import { validate } from '../../middleware/validator.js'
import { requireAdmin, type AuthEnv } from '../../middleware/auth.js'
import {
  patchAdminUserSchema,
  searchAdminUserSchema,
  userIdParamSchema,
  patchUserRoleSchema,
} from './schema.js'
import { adminService } from './service.js'

export const admin = new Hono<AuthEnv>()

admin.use(requireAdmin)

admin.get('/users', validate('query', searchAdminUserSchema), async (c) => {
  const input = c.req.valid('query')

  const tasks = await adminService.search(input)

  return c.json(tasks)
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
    const input = c.req.valid('json')

    const user = await adminService.update(userId, input)

    return c.json(user)
  },
)

admin.delete('/users/:userId', validate('param', userIdParamSchema), async (c) => {
  const { userId } = c.req.valid('param')
  const { id: executorId } = c.get('user')!

  await adminService.remove(userId, executorId, c.req.raw.headers)

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

export type InternalTasksAppType = typeof admin
