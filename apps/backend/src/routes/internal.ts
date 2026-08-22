import { Hono } from 'hono'
import { admin } from '../features/admin/internal.js'
import { apiKeys } from '../features/api-key/internal.js'
import { tasks } from '../features/task/internal.js'
import { me } from '../features/user/me.routes.js'
import { users } from '../features/user/users.routes.js'
import { requireAuth } from '../middleware/auth.js'

const internal = new Hono()

internal.use(requireAuth)

internal.route('/me', me)
internal.route('/users', users)
internal.route('/tasks', tasks)
internal.route('/admin', admin)
internal.route('/api-keys', apiKeys)

export default internal
