import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { apiKey as apiKeyTable } from '../../db/schema/api-key.js'

export type CreateApiKey = {
  userId: string
  name: string
  keyHash: string
  keyPrefix: string
}

export const apiKeyRepository = {
  create: async (input: CreateApiKey) => {
    const [apiKey] = await db.insert(apiKeyTable).values(input).returning({
      id: apiKeyTable.id,
      name: apiKeyTable.name,
      keyPrefix: apiKeyTable.keyPrefix,
      createdAt: apiKeyTable.createdAt,
      updatedAt: apiKeyTable.updatedAt,
    })

    return apiKey
  },

  findById: async (id: string) => {
    const [apiKey] = await db.select().from(apiKeyTable).where(eq(apiKeyTable.id, id))

    return apiKey ?? null
  },

  findByHash: async (keyHash: string) => {
    const [apiKey] = await db.select().from(apiKeyTable).where(eq(apiKeyTable.keyHash, keyHash))

    return apiKey ?? null
  },

  findByUserId: async (userId: string) => {
    return await db
      .select({
        id: apiKeyTable.id,
        name: apiKeyTable.name,
        keyPrefix: apiKeyTable.keyPrefix,
        lastUsedAt: apiKeyTable.lastUsedAt,
        createdAt: apiKeyTable.createdAt,
        updatedAt: apiKeyTable.updatedAt,
      })
      .from(apiKeyTable)
      .where(eq(apiKeyTable.userId, userId))
  },

  deleteById: async (id: string) => {
    await db.delete(apiKeyTable).where(eq(apiKeyTable.id, id))
  },

  touchLastUsedAt: async (id: string) => {
    await db.update(apiKeyTable).set({ lastUsedAt: new Date() }).where(eq(apiKeyTable.id, id))
  },
}
