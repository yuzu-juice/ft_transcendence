import { SignInForm } from '@/features/auth/components/SignInForm'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  // すでにログイン済みの場合リダイレクトする
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({
        to: '/mypage',
      })
    }
  },
  component: SignInForm,
})
