import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/client'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/mypage')({
  component: MyPage,
})

function MyPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const { refetch } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    await refetch()
    await router.invalidate({ sync: true })

    toast.info('サインアウトしました')

    await navigate({
      to: '/sign-in',
      replace: true,
    })
  }
  return (
    <>
      <div className="p-2">Hello from MyPage!</div>
      <Button type="button" onClick={handleSignOut}>
        サインアウト
      </Button>
    </>
  )
}
