import { db } from '../../db/index.js'
import { user as userTable } from '../../db/schema/auth.js'
import { eq, inArray } from 'drizzle-orm'

export const userRepository = {
  findAll: async () => {
    return await db
      .select({
        id: userTable.id,
        name: userTable.name,
        image: userTable.image,
      })
      .from(userTable)
  },

  findById: async (id: string) => {
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id))
    return user ?? null
  },

  findByIds: async (ids: string[]) => {
    if (ids.length === 0) {
      return []
    }

    return db
      .select({
        id: userTable.id,
      })
      .from(userTable)
      .where(inArray(userTable.id, ids))
  },

  update: async (id: string, name: string) => {
    const [user] = await db.update(userTable).set({ name }).where(eq(userTable.id, id)).returning()
    return user ?? null
  },
}
