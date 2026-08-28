import { Hono } from 'hono'
import { admin } from '../features/admin/internal.js'
import { apiKeys } from '../features/api-key/internal.js'
import { tasks } from '../features/task/tasks.routes.js'
import { me } from '../features/user/me.routes.js'
import { users } from '../features/user/users.routes.js'
import { requireAuth } from '../middleware/auth.js'
import { analytics } from '../features/task/analytics.routes.js'

const internal = new Hono()

internal.use(requireAuth)

internal.route('/me', me)
internal.route('/users', users)
internal.route('/tasks', tasks)
internal.route('/admin', admin)
internal.route('/api-keys', apiKeys)
internal.route('/analytics', analytics)

export default internal
