import { SignUpForm } from '@/features/auth/components/SignUpForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  component: SignUpForm,
})
