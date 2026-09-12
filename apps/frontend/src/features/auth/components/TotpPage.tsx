import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'
import { TotpChallenge } from './TotpChallenge'
import { TotpSetup } from './TotpSetup'

const totpRoute = getRouteApi('/totp')

export const TotpPage = () => {
  const { t } = useTranslation()
  // 検証成功時のセッション更新でチャレンジ画面を設定画面に切り替えない
  const session = totpRoute.useLoaderData()
  const navigate = useNavigate()

  // toastが2重に出てしまう問題の回避策
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (!session?.user.twoFactorEnabled) return
    if (redirectedRef.current) return

    redirectedRef.current = true

    toast.info(t('auth.error.totpAlreadyEnabled'))
    navigate({ to: '/mypage' })
  }, [session?.user.twoFactorEnabled, navigate, t])

  useEffect(() => {
    if (!session || session.user.twoFactorEnabled) return

    // toastが2重に出てしまう回避策
    let cancelled = false
    const checkCredential = async () => {
      const { data: accounts } = await authClient.listAccounts()
      if (cancelled) return
      const isCredential = accounts?.some((account) => account.providerId === 'credential') ?? false
      if (!isCredential) {
        toast.info(t('auth.totp.unavailable'))
        await navigate({ to: '/mypage' })
      }
    }

    void checkCredential()
    return () => {
      cancelled = true
    }
  }, [session, navigate, t])

  // セッションが存在しない == ログインチャレンジ中
  if (!session) {
    return <TotpChallenge />
  }

  // 2FAを有効化する
  return <TotpSetup />
}
