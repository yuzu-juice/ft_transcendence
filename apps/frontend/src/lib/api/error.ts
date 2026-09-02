import { DetailedError } from 'hono/client'

function getApiErrorMessage(code?: string) {
  switch (code) {
    case 'VALIDATION_ERROR':
      /* 本来発生しえないエラーのため、開発者向けにVALIDATION ERRORであることを明示 */
      return '通信中にエラーが発生しました（VALIDATION_ERROR）'
    case 'AUTH_REQUIRED':
      return '認証が必要です'
    case 'ADMIN_REQUIRED':
      return '管理者権限が必要です'
    case 'USER_NOT_FOUND':
      return 'ユーザが見つかりません'
    case 'TASK_NOT_FOUND':
      return 'タスクが見つかりません'
    case 'ASSIGNEE_NOT_FOUND':
      return '担当者が見つかりません'
    case 'AVATAR_NOT_FOUND':
      return 'アバターが見つかりません'
    case 'INVALID_AVATAR':
      return '無効な画像です'
    case 'AVATAR_TOO_LARGE':
      return '画像のサイズが大きすぎます'
    case 'UNSUPPORTED_AVATAR_TYPE':
      return 'サポートされていない画像タイプです'
    case 'INTERNAL_SERVER_ERROR':
      return 'サーバ内でエラーが発生しました'
    default:
      return undefined
  }
}

function getHttpErrorMessage(status: number) {
  switch (status) {
    case 401:
      return '認証が必要です'
    case 403:
      return 'アクセス権限がありません'
    case 404:
      return '対象が見つかりません'
    case 500:
      return 'サーバーでエラーが発生しました'
    default:
      return '通信に失敗しました'
  }
}

export const getErrorMessage = (error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(error)
  }

  // 今回の実装ではuseQuery/useMutationのすべての実装でHono RPCを使用する
  // したがって投げられるエラーはすべてHono RPCのparseResponseの投げるDetailedErrorであるはず
  if (!(error instanceof DetailedError)) {
    return '予期しないエラーが発生しました'
  }

  // APIの返すerror.detail.data.error.codeを参照しエラーメッセージを表示する
  if (typeof error.detail?.data?.error?.code === 'string') {
    const message = getApiErrorMessage(error.detail.data.error.code)
    if (message) {
      return message
    }
  }

  // 未知の code なら HTTP status にフォールバック
  if (typeof error.statusCode === 'number') {
    return getHttpErrorMessage(error.statusCode)
  }

  return '通信に失敗しました'
}
