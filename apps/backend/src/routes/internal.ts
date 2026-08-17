import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { me, users } from '../features/user/internal.js'
import { tasks } from '../features/task/internal.js'
import { admin } from '../features/admin/internal.js'

const internal = new Hono()

internal.use(requireAuth)

internal.route('/me', me)
internal.route('/users', users)
internal.route('/tasks', tasks)
internal.route('/admin', admin)

export default internal
