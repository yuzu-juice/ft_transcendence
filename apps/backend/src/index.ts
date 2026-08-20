import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { auth } from './auth/index.js'
import { onError } from './middleware/error.js'
import avatar from './routes/avatar.js'
import internal from './routes/internal.js'
import publicApi from './routes/public.js'

const healthResponseSchema = z.object({
  ok: z.boolean().openapi({ example: true }),
  service: z.string().openapi({ example: 'backend' }),
  timestamp: z.string().datetime().openapi({ example: '2026-08-19T00:00:00.000Z' }),
})

const healthRoute = createRoute({
  method: 'get',
  path: '/health',
  responses: {
    200: {
      description: 'Health check result',
      content: {
        'application/json': {
          schema: healthResponseSchema,
        },
      },
    },
  },
})

const app = new OpenAPIHono()

app.onError(onError)

app.notFound((c) => {
  return c.json(
    {
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found',
      },
    },
    404,
  )
})

app.openapi(healthRoute, (c) => {
  return c.json({
    ok: true,
    service: 'backend',
    timestamp: new Date().toISOString(),
  })
})

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Transcendence API',
    version: '1.0.0',
  },
})

app.get('/docs', swaggerUI({ url: '/api/openapi.json' }))

app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))

app.route('/internal', internal)
app.route('/', publicApi)
app.route('/avatar', avatar)

serve(
  {
    fetch: (req) => {
      const url = new URL(req.url)
      url.protocol = req.headers.get('x-forwarded-proto') ?? url.protocol
      return app.fetch(new Request(url, req))
    },
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
