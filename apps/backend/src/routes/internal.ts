import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { me, users } from '../features/user/internal.js'
import { tasks } from '../features/task/internal.js'
import { admin } from '../features/admin/internal.js'

const internalApp = new Hono()

internalApp.use(requireAuth)

internalApp.route('/me', me)
internalApp.route('/users', users)
internalApp.route('/tasks', tasks)
internalApp.route('/admin', admin)

export default internalApp
