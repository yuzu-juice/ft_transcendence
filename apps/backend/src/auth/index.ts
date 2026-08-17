import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/index.js'
import { betterAuthSchema } from '../db/schema/auth.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: betterAuthSchema,
  }),
  basePath: '/auth',
  user: {
    additionalFields: {
      role: {
        type: 'string',
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    trustedProxyHeaders: true,
  },
})
