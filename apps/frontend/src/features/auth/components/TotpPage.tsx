import { authClient } from '@/lib/auth/client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Loading } from '@/components/ui/Loading'
import { TotpSetup } from './TotpSetup'
import { TotpChallenge } from './TotpChallenge'
import { useEffect, useRef } from 'react'

// TODO: i18n
export const TotpPage = () => {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  if (isPending) {
    return <Loading />
  }

  // セッションが存在しない == ログインチャレンジ中
  if (!session) {
    return <TotpChallenge />
  }

  // toastが2重に出てしまう問題の回避策
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (!session?.user.twoFactorEnabled) return
    if (redirectedRef.current) return

    redirectedRef.current = true

    toast.info('既に2要素認証が有効化されています')
    navigate({ to: '/mypage' })
  }, [session?.user.twoFactorEnabled, navigate])

  useEffect(() => {
    // toastが2重に出てしまう回避策
    let cancelled = false
    const checkCredential = async () => {
      const { data: accounts } = await authClient.listAccounts()
      if (cancelled) return
      const isCredential = accounts?.some((account) => account.providerId === 'credential') ?? false
      if (!isCredential) {
        toast.info('このアカウントで2要素認証を有効化することはできません')
        await navigate({ to: '/mypage' })
      }
    }

    void checkCredential()
    return () => {
      cancelled = true
    }
  }, [navigate])

  // 2FAを有効化する
  return <TotpSetup />
}
