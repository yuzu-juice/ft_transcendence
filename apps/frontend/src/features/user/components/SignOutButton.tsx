import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'

export const SignOutButton = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { refetch } = authClient.useSession()

  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error(t('user.signOut.failed'))
      return
    }

    await refetch()
    await router.invalidate({ forcePending: true })
    toast.info(t('user.signOut.success'))
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-heading font-bold">{t('user.signOut.title')}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-linear-to-r from-rose-400 to-rose-500 duration-300 font-bold text-white px-4 py-6 shadow-lg shadow-brand-primary rounded-sm cursor-pointer hover:-translate-y-0.5 transition-all"
        >
          {t('user.signOut.button')}
        </button>
      </div>
    </div>
  )
}
