import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { SignUpForm } from '@/features/auth/components/SignUpForm'
import i18n from '@/lib/i18n/config'

export const Route = createFileRoute('/sign-up')({
  // すでにログイン済みの場合リダイレクトする
  beforeLoad: async ({ context }) => {
    const { data: session, error } = await context.getSession()
    if (error) {
      toast.error(i18n.t('error.unexpected'))
      throw redirect({
        to: '/',
      })
    }
    if (session) {
      throw redirect({
        to: '/mypage',
      })
    }
  },
  component: SignUpForm,
})
