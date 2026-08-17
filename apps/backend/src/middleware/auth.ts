import { createMiddleware } from 'hono/factory'
import { auth } from '../auth/index.js'
import { AppError } from '../errors/app-error.js'

export type AuthEnv = {
  Variables: {
    session: typeof auth.$Infer.Session.session | null
    user: typeof auth.$Infer.Session.user | null
  }
}

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    throw new AppError('AUTH_REQUIRED', 401, 'Authentication required')
  }

  c.set('session', session.session)
  c.set('user', session.user)

  await next()
})

export const requireAdmin = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get('user')!

  if (user.role !== 'admin') {
    throw new AppError('ADMIN_REQUIRED', 403, 'Administrator privileges are required')
  }

  await next()
})
