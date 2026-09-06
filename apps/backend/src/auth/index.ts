import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, twoFactor } from 'better-auth/plugins'

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
    twoFactor({
      issuer: 'LunaPhase',
    }),
  ],
  basePath: '/api/auth',
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  advanced: {
    trustedProxyHeaders: true,
  },
})
