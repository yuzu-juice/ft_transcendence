import { createFileRoute } from '@tanstack/react-router'
import { TotpPage } from '@/features/auth/components/TotpPage'

export const Route = createFileRoute('/totp')({
  // ルートの遷移が決定した際に、
  // コンポーネントが描画される前に並列で非同期データを事前に取得する仕組み
  loader: ({ context }) => context.getSession(),
  component: TotpPage,
})
