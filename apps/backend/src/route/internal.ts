import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'

const internalApp = new Hono()

internalApp.use(requireAuth)

internalApp.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default internalApp
