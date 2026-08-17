import { auth } from '../src/auth/index.js'
import { db } from '../src/db/index.js'

if (process.env.NODE_ENV === 'production') {
  throw new Error('seed-dev must not run in production')
}

const DEV_SEED_EMAIL = 'dev-user-1@example.test'

const seeded = await db.query.user.findFirst({
  where: {
    email: DEV_SEED_EMAIL,
  },
})

if (seeded) {
  console.log('Development seed already exists. Skipping.')
  process.exit(0)
}

await auth.api.signUpEmail({
  body: {
    name: 'Dev User 1',
    email: DEV_SEED_EMAIL,
    password: 'password123',
  },
})
