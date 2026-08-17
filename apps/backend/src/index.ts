import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from './auth/index.js'
import { onError } from './middleware/error.js'

const app = new Hono()

app.onError(onError)

app.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

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
