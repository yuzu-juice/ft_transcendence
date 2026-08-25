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

const authRequired = {
  error: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
  },
}

export const requireApiKey = bearerAuth<ApiKeyAuthEnv>({
  verifyToken: async (token, c) => {
    const authenticated = await apiKeyService.authenticate(token)
    const user = await userRepository.findById(authenticated.userId)

    if (!user) {
      return false
    }

    c.set('apiKey', { id: authenticated.apiKeyId, userId: authenticated.userId })
    c.set('user', { id: user.id, role: user.role })

    return true
  },

  noAuthenticationHeader: {
    message: authRequired,
  },

  invalidToken: {
    message: authRequired,
  },

  invalidAuthenticationHeader: {
    message: authRequired,
  },
})
