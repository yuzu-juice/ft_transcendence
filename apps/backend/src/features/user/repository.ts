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
    const [user] = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        image: userTable.image,
        role: userTable.role,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
      })
      .from(userTable)
      .where(eq(userTable.id, id))
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

  findImageById: async (id: string) => {
    const user = await db.query.user.findFirst({
      where: {
        id,
      },
      columns: {
        image: true,
      },
    })

    return user?.image
  },

  update: async (id: string, name: string) => {
    const [user] = await db.update(userTable).set({ name }).where(eq(userTable.id, id)).returning()
    return user ?? null
  },

  updateImage: async (id: string, image: string | null) => {
    const [user] = await db.update(userTable).set({ image }).where(eq(userTable.id, id)).returning({
      image: userTable.image,
    })

    return user ?? null
  },
}
