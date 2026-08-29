import { CustomLink } from '@/components/ui/CustomLink'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/client'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const router = useRouter()
  const { data: session, refetch } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    toast.info('サインアウトしました')
    await refetch()
    await router.invalidate()
  }

  return (
    <main className="min-h-dvh w-full flex items-center justify-center">
      <section className="flex flex-col gap-2.5 justify-center text-center">
        <h1 className="text-6xl font-bold text-brand-primary">LunaPhase</h1>
        <p className="text-xl">ちょー簡単に操作できるプロジェクト管理アプリ</p>
        {/* 一時的に配置している仮のサインイン・サインアウトボタン */}
        {!session ? (
          <CustomLink to="/sign-in" className="text-lg">
            サインイン
          </CustomLink>
        ) : (
          <Button onClick={handleSignOut}>サインアウト</Button>
        )}
      </section>
    </main>
  )
}
