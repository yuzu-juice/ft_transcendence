import { TotpPage } from '@/features/auth/components/TotpPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/totp')({
  component: TotpPage,
})
