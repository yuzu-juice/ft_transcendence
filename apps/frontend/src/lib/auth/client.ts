import { adminClient, twoFactorClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { router } from '@/main'

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        void router.navigate({
          to: '/totp',
        })
      },
    }),
  ],
})
