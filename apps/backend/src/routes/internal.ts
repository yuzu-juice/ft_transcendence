import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { me, users } from '../features/user/internal.js'

const internalApp = new Hono()

internalApp.use(requireAuth)

internalApp.route('/me', me)
internalApp.route('/users', users)

export default internalApp
