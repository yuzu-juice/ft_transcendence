import { createMiddleware } from 'hono/factory'
import { AppError } from '../errors/app-error.js'
import { apiKeyService } from '../features/api-key/service.js'
import { userRepository } from '../features/user/repository.js'
import { bearerAuth } from 'hono/bearer-auth'

export type ApiKeyAuthEnv = {
  Variables: {
    apiKey: {
      id: string
      userId: string
    }
    user: {
      id: string
      role: string
    }
  }
}

const verifyApiKeyToken = async (
  token: string,
  c: { set: (key: 'apiKey' | 'user', value: unknown) => void },
) => {
  const authenticated = await apiKeyService.authenticate(token)
  const user = await userRepository.findById(authenticated.userId)

  if (!user) {
    throw new AppError('AUTH_REQUIRED', 401, 'Authentication required')
  }

  c.set('apiKey', {
    id: authenticated.apiKeyId,
    userId: authenticated.userId,
  })

  c.set('user', {
    id: user.id,
    role: user.role,
  })

  return true
}

// optional verifyToken: (token: string, c: Context) => boolean | Promise<boolean>
const bearerApiKeyAuth = bearerAuth<ApiKeyAuthEnv>({
  verifyToken: verifyApiKeyToken,
})

export const requireApiKey = createMiddleware<ApiKeyAuthEnv>(async (c, next) => {
  const authorization = c.req.header('authorization')
  if (!authorization) {
    throw new AppError('AUTH_REQUIRED', 401, 'Authentication required')
  }

  return bearerApiKeyAuth(c, next)
})
