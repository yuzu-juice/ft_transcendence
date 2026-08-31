import { type ApplyGlobalResponse, hc } from 'hono/client'
import type { InternalAppType } from './routes/internal.js'

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

// ref: https://hono.dev/docs/guides/rpc#known-issues
export type InternalClient = ReturnType<typeof hc<AppWithErrors>>

export const createInternalClient = (...args: Parameters<typeof hc>): InternalClient =>
  hc<AppWithErrors>(...args)
