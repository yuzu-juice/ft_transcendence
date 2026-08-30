import { useNavigate, useRouter } from '@tanstack/react-router'

import { authClient } from '@/lib/auth/client'
import { toast } from 'sonner'

export const SignOutButton = () => {
  const router = useRouter()
  const navigate = useNavigate()
  const { refetch } = authClient.useSession()

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error('サインアウトに失敗しました')
      return
    }

    await refetch()
    await router.invalidate({ sync: true })

    toast.info('サインアウトしました')

    await navigate({
      to: '/',
    })
  }
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-heading font-bold">アカウント</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-linear-to-r from-rose-400 to-rose-500 duration-300 font-bold text-white px-4 py-6 shadow-lg shadow-brand-primary rounded-sm cursor-pointer hover:-translate-y-0.5 transition-all"
        >
          サインアウト
        </button>
      </div>
    </div>
  )
}
