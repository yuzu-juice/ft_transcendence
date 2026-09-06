import { authClient } from '@/lib/auth/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from 'otsukimi-ui'
import { useAppForm } from '@/components/form/form'
import { TotpEnableSchema } from '../schema'
import { AuthLayout } from './AuthLayout'
import { useEffect, useState } from 'react'
import {
  getBetterAuthErrorMessage,
  totpEnableMutationOptions,
  totpVerifyMutationOptions,
} from '../mutation'
import { AuthErrorAlert } from './AuthErrorAlert'
import QRCode from 'react-qr-code'
import { useRouter } from '@tanstack/react-router'
import { TotpCodeForm } from './TotpCodeForm'

export const TotpSetup = () => {
  const router = useRouter()
  const { refetch } = authClient.useSession()

  const totpEnableMutation = useMutation(totpEnableMutationOptions)

  const [hasCredential, setHasCredential] = useState<boolean>(false)
  const [totpURI, setTotpURI] = useState<string>()

  const form = useAppForm({
    defaultValues: {
      password: '',
    },
    validators: {
      onChange: hasCredential ? TotpEnableSchema : undefined,
      onSubmit: hasCredential ? TotpEnableSchema : undefined,
    },
    onSubmit: async ({ value }) => {
      const data = await totpEnableMutation.mutateAsync(value)
      if (data.method !== 'totp') {
        return
      }

      toast.info('パスワードを認証しました')
      setTotpURI(data.totpURI)
    },
  })

  const totpVerifyMutation = useMutation({
    ...totpVerifyMutationOptions,
    onSuccess: async () => {
      await refetch()
      await router.invalidate({ forcePending: true })
      toast.info('2要素認証を有効化しました')
      await router.navigate({ to: '/mypage', replace: true })
    },
  })

  // accountのproviderIdがcredential（email・パスワードによる認証）の場合、
  // 2FAを有効化する前に現在のパスワードを送信する必要がある
  useEffect(() => {
    void authClient.listAccounts().then(({ data }) => {
      setHasCredential(data?.some((account) => account.providerId === 'credential') ?? false)
    })
  }, [])

  const renderContent = () => {
    if (!totpURI) {
      return (
        <form
          noValidate
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          {hasCredential && (
            <form.AppField name="password">
              {(field) => (
                <field.TextField
                  label="現在のパスワード"
                  type="password"
                  autoComplete="current-password"
                  placeholder="password"
                />
              )}
            </form.AppField>
          )}

          {totpEnableMutation.isError && (
            <AuthErrorAlert message={getBetterAuthErrorMessage(totpEnableMutation.error)} />
          )}

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '確認しています...' : '二要素認証を有効にする'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      )
    } else {
      return (
        <div className="flex flex-col gap-3">
          <p>1. 認証アプリを端末にインストールしてください</p>
          <p>2. 以下のQRコードをスキャンしてください</p>
          <div className="h-auto mx-auto max-w-64 w-full">
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={totpURI}
              viewBox={`0 0 256 256`}
            />
          </div>
          <p>3. 認証コードを入力してください</p>
          <TotpCodeForm
            onSubmit={(code) => totpVerifyMutation.mutateAsync({ code })}
            isPending={totpVerifyMutation.isPending}
            errorMessage={
              totpVerifyMutation.isError
                ? getBetterAuthErrorMessage(totpVerifyMutation.error)
                : undefined
            }
          />
        </div>
      )
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">二要素認証を有効化する</h2>
      {renderContent()}
    </AuthLayout>
  )
}
