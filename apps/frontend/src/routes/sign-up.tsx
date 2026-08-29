import { SignUpForm } from '@/features/auth/components/SignUpForm'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  // すでにログイン済みの場合リダイレクトする
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: SignUpForm,
})
