import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignUpForm } from '@/features/auth/components/SignUpForm'

export const Route = createFileRoute('/sign-up')({
  // すでにログイン済みの場合リダイレクトする
  beforeLoad: async ({ context }) => {
    const session = await context.getSession()
    if (session) {
      throw redirect({
        to: '/mypage',
      })
    }
  },
  component: SignUpForm,
})
