import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'
import { getBetterAuthErrorMessage, totpVerifyMutationOptions } from '../mutation'
import { AuthLayout } from './AuthLayout'
import { TotpCodeForm } from './TotpCodeForm'

export const TotpChallenge = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { refetch } = authClient.useSession()

  const totpVerifyMutation = useMutation({
    ...totpVerifyMutationOptions,
    onSuccess: async () => {
      await refetch()
      toast.info(t('auth.totp.challenge.success'))
      await router.navigate({ to: '/mypage', replace: true })
    },
    onError: () => {},
  })

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">{t('auth.totp.title')}</h2>
      <TotpCodeForm
        onSubmit={(code) => totpVerifyMutation.mutateAsync({ code })}
        isPending={totpVerifyMutation.isPending}
        errorMessage={
          totpVerifyMutation.isError
            ? getBetterAuthErrorMessage(totpVerifyMutation.error)
            : undefined
        }
      />
    </AuthLayout>
  )
}
