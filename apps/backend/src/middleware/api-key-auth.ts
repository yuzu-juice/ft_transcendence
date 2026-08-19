import { createMiddleware } from 'hono/factory'
import { AppError } from '../errors/app-error.js'
import { apiKeyService } from '../features/api-key/service.js'
import { userRepository } from '../features/user/repository.js'

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

function extractBearerToken(value: string | undefined): string | null {
  if (!value) {
    return null
  }

  const [scheme, token] = value.split(' ')

  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
    return null
  }

  return token
}

export const requireApiKey = createMiddleware<ApiKeyAuthEnv>(async (c, next) => {
  const token = extractBearerToken(c.req.header('authorization'))

  if (!token) {
    throw new AppError('API_KEY_REQUIRED', 401, 'API key is required')
  }

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

  await next()
})
