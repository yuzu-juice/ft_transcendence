import { Hono } from 'hono'
import { admin } from '../features/admin/internal.js'
import { apiKeys } from '../features/api-key/internal.js'
import { tasks } from '../features/task/tasks.routes.js'
import { me } from '../features/user/me.routes.js'
import { users } from '../features/user/users.routes.js'
import { requireAuth } from '../middleware/auth.js'
import { analytics } from '../features/task/analytics.routes.js'

const internal = new Hono()
  .use(requireAuth)
  .route('/me', me)
  .route('/users', users)
  .route('/tasks', tasks)
  .route('/admin', admin)
  .route('/api-keys', apiKeys)
  .route('/analytics', analytics)

export default internal

export type InternalAppType = typeof internal
