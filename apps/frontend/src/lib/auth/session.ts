import { authClient } from './client'

// Reactの再描画を待たず、ルートの判定時点のセッションを取得する。
export const getSession = async () => {
  const { data, error } = await authClient.getSession()
  if (error) {
    throw new Error(error.message ?? 'Failed to fetch session')
  }
  return data
}
