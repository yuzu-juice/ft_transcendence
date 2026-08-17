import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from './auth/index.js'
import { onError } from './middleware/error.js'
import internalApp from './routes/internal.js'

const app = new Hono()

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

app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))

app.route('/internal', internalApp)

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
