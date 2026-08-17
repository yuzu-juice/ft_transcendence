import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'

import { db } from '../db/index.js'
import { betterAuthSchema } from '../db/schema/auth.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: betterAuthSchema,
  }),
  plugins: [
    admin({
      defaultRole: 'user',
      adminRoles: ['admin'],
    }),
  ],
  basePath: '/auth',
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    trustedProxyHeaders: true,
  },
})
