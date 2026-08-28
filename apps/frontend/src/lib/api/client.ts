import type { InternalAppType } from '@ft/backend/app'
// TODO: あらかじめコンパイルされたhc型を使用するよう実装を変更する
import { type ApplyGlobalResponse, hc } from 'hono/client'

// バックエンドAPIから返却されるエラー型
type ErrorResponse = {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// グローバルなエラーレスポンス型（app.onError()やミドルウェア等で返却する型）についても
// 型推論可能にするためにApplyGlobalResponse型ヘルパーを使用する
// Ref: https://hono-ja.pages.dev/docs/guides/rpc#global-response
type AppWithErrors = ApplyGlobalResponse<
  InternalAppType,
  {
    400: { json: ErrorResponse }
    401: { json: ErrorResponse }
    403: { json: ErrorResponse }
    404: { json: ErrorResponse }
    409: { json: ErrorResponse }
    413: { json: ErrorResponse }
    415: { json: ErrorResponse }
    500: { json: ErrorResponse }
  }
>

// Hono RPC機能を使用してバックエンドとフロントエンド間でAPIの仕様を共有する
// ref: https://hono-ja.pages.dev/docs/guides/rpc#クライアント
export const client = hc<AppWithErrors>('/api/internal', {
  // Better Authの使用するCookieを送る
  init: {
    credentials: 'include',
  },
})
