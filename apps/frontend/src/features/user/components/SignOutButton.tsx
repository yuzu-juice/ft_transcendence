import { useNavigate, useRouter } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/client'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'

export const SignOutButton = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const { refetch } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()
    await refetch()
    await router.invalidate({ sync: true })

    toast.info('サインアウトしました')

    await navigate({
      to: '/',
    })
  }
  return (
    <div className="flex flex-col gap-4">
      <Button
        type="button"
        onClick={handleSignOut}
        className="bg-red-500 text-white p-2 rounded-sm"
      >
        サインアウト
      </Button>
    </div>
  )
}
