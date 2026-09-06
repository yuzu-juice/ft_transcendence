import { authClient } from '@/lib/auth/client'
import { TotpCodeForm } from './TotpCodeForm'
import { useRouter } from '@tanstack/react-router'
import { getBetterAuthErrorMessage, totpVerifyMutationOptions } from '../mutation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'

export const TotpChallenge = () => {
  const router = useRouter()
  const { refetch } = authClient.useSession()

  const totpVerifyMutation = useMutation({
    ...totpVerifyMutationOptions,
    onSuccess: async () => {
      await refetch()
      await router.invalidate({ forcePending: true })
      toast.info('2要素認証に成功しました')
      await router.navigate({ to: '/mypage', replace: true })
    },
  })

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">二要素認証</h2>
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
