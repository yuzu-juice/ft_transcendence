import { DatabaseError } from 'pg'
import { db } from '../../db/index.js'
import { user as userTable, type UserRole } from '../../db/schema/auth.js'
import { or, ilike, eq, and, sql, SQL, desc } from 'drizzle-orm'
import { AppError } from '../../errors/app-error.js'
import { auth } from 'hono/utils/basic-auth'

export type AdminUpdateUser = {
  email?: string
  name?: string
}

export type SearchUser = {
  q?: string
  role?: UserRole
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

  // TODO: userRepository.findByIdと同一実装のため統合する?
  findById: async (id: string) => {
    const [user] = await db.select().from(userTable).where(eq(userTable.id, id))
    return user ?? null
  },

  update: async (id: string, input: AdminUpdateUser) => {
    const [user] = await db.update(userTable).set(input).where(eq(userTable.id, id)).returning()

    return user ?? null
  },
}
