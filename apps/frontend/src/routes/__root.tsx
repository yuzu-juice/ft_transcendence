import { NotFoundPage } from '@/components/layout/NotFoundPage'
import type { authClient } from '@/lib/auth/client'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// RouterContextを拡張してBetter Authの提供するsessionの情報を渡せるようにする
export interface RouterContext {
  session: typeof authClient.$Infer.Session | null
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
