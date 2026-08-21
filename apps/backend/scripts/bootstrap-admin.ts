import { eq } from 'drizzle-orm'

import { auth } from '../src/auth/index.js'
import { db, pool } from '../src/db/index.js'
import { user } from '../src/db/schema/auth.js'

const email = process.env.INITIAL_ADMIN_EMAIL
const password = process.env.INITIAL_ADMIN_PASSWORD

if (!email || !password) {
  throw new Error('INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD are required.')
}

const existingAdmin = await db.query.user.findFirst({
  where: {
    role: 'admin',
  },
})

if (existingAdmin) {
  console.log('Admin already exists. Skipping.')
  process.exit(0)
}

const existingUser = await db.query.user.findFirst({
  where: {
    email: email,
  },
})

if (existingUser) {
  throw new Error(`User ${email} already exists, but is not admin`)
}

const result = await auth.api.signUpEmail({
  body: {
    name: `Admin`,
    email,
    password,
  },
})

await db
  .update(user)
  .set({
    role: 'admin',
  })
  .where(eq(user.id, result.user.id))

console.log(`Initial admin created: ${email}`)

await pool.end()
