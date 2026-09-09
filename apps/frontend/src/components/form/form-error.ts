import { useTranslation } from 'react-i18next'

export const getFormErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  return undefined
}

export const useFormErrorMessage = (error: unknown) => {
  const { t } = useTranslation()
  const key = getFormErrorMessage(error)

  // keyが見つからない場合のフォールバック値を指定する
  // まだ翻訳キーが割り当てられていない状態では、既存の日本語エラーメッセージを表示する
  return key ? t(key, { defaultValue: key }) : undefined
}
