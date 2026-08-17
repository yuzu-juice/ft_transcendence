import { and, desc, eq, ilike, or, type SQL, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { user as userTable } from '../../db/schema/auth.js'

export type AdminUpdateUser = {
  email?: string
  name?: string
}

export type SearchUser = {
  q?: string
  role?: 'admin' | 'user'
}

function buildSearchWhere(u: typeof userTable, input: SearchUser): SQL {
  const conditions: SQL[] = []

  if (input.q) {
    const condition = or(ilike(u.name, `%${input.q}%`), ilike(u.email, `%${input.q}%`))

    if (condition) {
      conditions.push(condition)
    }
  }

  if (input.role) {
    conditions.push(eq(u.role, input.role))
  }

  return and(...conditions) ?? sql`true`
}

export const adminRepository = {
  search: async (input: SearchUser) => {
    return await db.query.user.findMany({
      where: {
        RAW: (u) => buildSearchWhere(u, input),
      },
      orderBy: (t) => {
        return [desc(t.role), desc(t.id)]
      },
    })
  },

  findById: async (id: string) => {
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id))
    return user ?? null
  },

  update: async (id: string, input: AdminUpdateUser) => {
    const [user] = await db.update(userTable).set(input).where(eq(userTable.id, id)).returning()

    return user ?? null
  },

  setRole: async (id: string, role: 'admin' | 'user') => {
    const [user] = await db.update(userTable).set({ role }).where(eq(userTable.id, id)).returning()

    return user ?? null
  },
}
