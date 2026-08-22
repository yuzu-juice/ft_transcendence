import { createHash, randomBytes } from 'node:crypto'
import { AppError } from '../../errors/app-error.js'
import { apiKeyRepository } from './repository.js'

function hashApiKey(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function generateApiKeyValue(): string {
  return `ft_${randomBytes(24).toString('base64url')}`
}

function apiKeyPrefix(value: string): string {
  return value.slice(0, 12)
}

export const apiKeyService = {
  hash: (value: string) => hashApiKey(value),

  create: async (userId: string, name: string) => {
    const rawKey = generateApiKeyValue()
    const keyHash = hashApiKey(rawKey)

    const created = await apiKeyRepository.create({
      userId,
      name,
      keyHash,
      keyPrefix: apiKeyPrefix(rawKey),
    })

    return {
      ...created,
      key: rawKey,
    }
  },

  listByUserId: async (userId: string) => {
    return await apiKeyRepository.findByUserId(userId)
  },

  remove: async (apiKeyId: string, userId: string) => {
    const apiKey = await apiKeyRepository.findById(apiKeyId)

    if (!apiKey) {
      throw new AppError('API_KEY_NOT_FOUND', 404, 'API key not found')
    }

    if (apiKey.userId !== userId) {
      throw new AppError('API_KEY_FORBIDDEN', 403, 'You cannot delete this API key')
    }

    await apiKeyRepository.deleteById(apiKeyId)
  },

  authenticate: async (rawKey: string) => {
    const keyHash = hashApiKey(rawKey)
    const apiKey = await apiKeyRepository.findByHash(keyHash)

    if (!apiKey) {
      throw new AppError('API_KEY_INVALID', 401, 'Invalid API key')
    }

    await apiKeyRepository.touchLastUsedAt(apiKey.id)

    return {
      userId: apiKey.userId,
      apiKeyId: apiKey.id,
    }
  },
}
