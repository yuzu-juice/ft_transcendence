import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'sonner'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { queryClient } from '@/lib/query/client'

import { routeTree } from './routeTree.gen'
import './index.css'

import '@fontsource/line-seed-jp/400.css'
import '@fontsource/line-seed-jp/700.css'
import '@fontsource/zen-maru-gothic/400.css'
import '@fontsource/zen-maru-gothic/700.css'
import { getSession } from './lib/auth/session'

import '@/lib/i18n/config'
import { WebMcpProvider } from './lib/webmcp/WebMcpProvider'

export const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingScreen,
  context: {
    getSession,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <>
      <RouterProvider
        router={router}
        context={{
          session,
        }}
      />
      <WebMcpProvider />
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
