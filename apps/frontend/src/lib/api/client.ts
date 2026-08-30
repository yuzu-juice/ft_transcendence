import { createInternalClient } from '@ft/backend/client'

// Hono RPC機能を使用してバックエンドとフロントエンド間でAPIの仕様を共有する
// ref: https://hono-ja.pages.dev/docs/guides/rpc#クライアント
export const client = createInternalClient('/api/internal', {
  // Better Authの使用するCookieを送る
  init: {
    credentials: 'include',
  },
})
