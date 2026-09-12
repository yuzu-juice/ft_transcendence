import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'
import { TotpPage } from '@/features/auth/components/TotpPage'
import i18n from '@/lib/i18n/config'

export const Route = createFileRoute('/totp')({
  // ルートの遷移が決定した際に、
  // コンポーネントが描画される前に並列で非同期データを事前に取得する仕組み
  loader: async ({ context }) => {
    const { data: session, error } = await context.getSession()
    if (error) {
      toast.error(i18n.t('error.unexpected'))
      throw redirect({
        to: '/',
      })
    }
    return session
  },
  component: TotpPage,
})
