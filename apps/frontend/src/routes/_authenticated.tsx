import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { CommonLayout } from '@/components/layout/CommonLayout'
import i18n from '@/lib/i18n/config'

// Tanstack RouterのPath less routeという機能を用いている
// _authenticatedディレクトリ内で実装される全てのページに対し以下の実装が適用される、というイメージ
// ref: https://tanstack.com/router/latest/docs/guide/authenticated-routes
export const Route = createFileRoute('/_authenticated')({
  // Load前にBetter Authから最新のセッションを取得して確認する
  // 存在しない場合は/sign-inページへとリダイレクトされる
  beforeLoad: async ({ context }) => {
    const { data: session, error } = await context.getSession()
    if (error) {
      toast.error(i18n.t('error.unexpected'))
      throw redirect({
        to: '/',
      })
    }
    if (!session) {
      throw redirect({
        to: '/sign-in',
      })
    }
    return {
      user: session.user,
    }
  },

  component: () => {
    return (
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    )
  },
})
