import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { me } from '../features/user/internal.js'

const internalApp = new Hono()

internalApp.use(requireAuth)

internalApp.route('/me', me)

export default internalApp
