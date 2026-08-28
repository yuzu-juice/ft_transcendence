import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// Tanstack RouterのPath less routeという機能を用いている
// _authenticatedディレクトリ内で実装される全てのページに対し以下の実装が適用される、というイメージ
// ref: https://tanstack.com/router/latest/docs/guide/authenticated-routes
export const Route = createFileRoute('/_authenticated')({
  // Load前にBetter Authによって管理されるsessionがcontext内に存在するか確認する
  // 存在しない場合は/sign-inページへとリダイレクトされる
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({
        to: '/sign-in',
      })
    }
    return {
      user: context.session.user,
    }
  },

  component: Outlet,
})
