import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { NotFoundPage } from '@/components/layout/NotFoundPage'
import type { getSession } from '@/lib/auth/session'

// 認証ガードが最新のセッションを取得できるようにする
export interface RouterContext {
  getSession: typeof getSession
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => <NotFoundPage />,
})
