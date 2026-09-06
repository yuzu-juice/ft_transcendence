import { DetailedError } from 'hono/client'
import i18n from '@/lib/i18n/config'

function getApiErrorMessage(code?: string) {
  switch (code) {
    case 'VALIDATION_ERROR':
      return i18n.t('error.api.validation')
    case 'AUTH_REQUIRED':
      return i18n.t('error.api.authRequired')
    case 'ADMIN_REQUIRED':
      return i18n.t('error.api.adminRequired')
    case 'USER_NOT_FOUND':
      return i18n.t('error.api.userNotFound')
    case 'TASK_NOT_FOUND':
      return i18n.t('error.api.taskNotFound')
    case 'ASSIGNEE_NOT_FOUND':
      return i18n.t('error.api.assigneeNotFound')
    case 'AVATAR_NOT_FOUND':
      return i18n.t('error.api.avatarNotFound')
    case 'INVALID_AVATAR':
      return i18n.t('error.api.invalidAvatar')
    case 'AVATAR_TOO_LARGE':
      return i18n.t('error.api.avatarTooLarge')
    case 'UNSUPPORTED_AVATAR_TYPE':
      return i18n.t('error.api.unsupportedAvatarType')
    case 'INTERNAL_SERVER_ERROR':
      return i18n.t('error.api.internalServerError')
    default:
      return undefined
  }
}

function getHttpErrorMessage(status: number) {
  switch (status) {
    case 401:
      return i18n.t('error.http.401')
    case 403:
      return i18n.t('error.http.403')
    case 404:
      return i18n.t('error.http.404')
    case 500:
      return i18n.t('error.http.500')
    default:
      return i18n.t('error.http.default')
  }
}

export const getErrorMessage = (error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(error)
  }

  // 今回の実装ではuseQuery/useMutationのすべての実装でHono RPCを使用する
  // したがって投げられるエラーはすべてHono RPCのparseResponseの投げるDetailedErrorであるはず
  if (!(error instanceof DetailedError)) {
    return i18n.t('error.unexpected')
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

  return i18n.t('error.http.default')
}
