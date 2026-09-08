import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignInForm } from '@/features/auth/components/SignInForm'
import { SignInSearchSchema } from '@/features/auth/schema'

export const Route = createFileRoute('/sign-in')({
  // すでにログイン済みの場合リダイレクトする
  beforeLoad: async ({ context }) => {
    const session = await context.getSession()
    if (session) {
      throw redirect({
        to: '/mypage',
      })
    }
  },
  validateSearch: SignInSearchSchema,
  component: SignInForm,
})
