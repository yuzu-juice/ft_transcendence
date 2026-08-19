import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { publicTasks } from '../features/task/public.js'
import { requireApiKey } from '../middleware/api-key-auth.js'

const publicApi = new OpenAPIHono()

publicApi.doc('/docs/openapi', {
  openapi: '3.1.0',
  info: {
    title: 'Transcendence Public API',
    version: '0.1.0',
    description: 'Public API for API key based access',
  },
  servers: [
    {
      url: '/',
      description: 'Current host (the reverse proxy exposes the API below /api)',
    },
  ],
})

publicApi.get('/docs', swaggerUI({ url: '/api/docs/openapi' }))

publicApi.use('/tasks', requireApiKey)
publicApi.use('/tasks/*', requireApiKey)

publicApi.route('/tasks', publicTasks)

export default publicApi
