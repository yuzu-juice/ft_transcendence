import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { queryClient } from '@/lib/query/client'
import { LoadingScreen } from '@/components/layout/LoadingScreen'

import { routeTree } from './routeTree.gen'
import './index.css'

import '@fontsource/line-seed-jp/400.css'
import '@fontsource/line-seed-jp/700.css'
import '@fontsource/zen-maru-gothic/400.css'
import '@fontsource/zen-maru-gothic/700.css'
import { authClient } from './lib/auth/client'

const router = createRouter({
  routeTree,
  context: {
    session: null,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  // useSession()を使用しログイン中のセッションの情報・ユーザの情報を取得する
  const { data: session, isPending } = authClient.useSession()

  // セッション情報を取得中はLoadingScreenを表示
  if (isPending) {
    return <LoadingScreen />
  }

  return (
    <>
      <RouterProvider
        router={router}
        context={{
          session,
        }}
      />
      {/* toaster用 */}
      <Toaster richColors position="top-center" />
    </>
  )
}

// 以下はテンプレート
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
}
