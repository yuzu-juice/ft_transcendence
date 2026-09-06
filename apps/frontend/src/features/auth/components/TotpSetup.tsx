import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Button } from 'otsukimi-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { authClient } from '@/lib/auth/client'
import {
  getBetterAuthErrorMessage,
  totpEnableMutationOptions,
  totpVerifyMutationOptions,
} from '../mutation'
import { TotpEnableSchema } from '../schema'
import { AuthErrorAlert } from './AuthErrorAlert'
import { AuthLayout } from './AuthLayout'
import { TotpCodeForm } from './TotpCodeForm'

export const TotpSetup = () => {
  const { t } = useTranslation()
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

      toast.info(t('auth.totp.setup.passwordVerified'))
      setTotpURI(data.totpURI)
    },
  })

  const totpVerifyMutation = useMutation({
    ...totpVerifyMutationOptions,
    onSuccess: async () => {
      await refetch()
      toast.info(t('auth.totp.setup.enabled'))
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
      // 現在のパスワードを確認する
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
                  label={t('auth.fields.currentPassword.label')}
                  type="password"
                  autoComplete="current-password"
                  placeholder={t('auth.fields.password.placeholder')}
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
                {isSubmitting ? t('auth.totp.setup.enabling') : t('auth.totp.setup.enable')}
              </Button>
            )}
          </form.Subscribe>
        </form>
      )
    } else {
      // 認証アプリと連携するためのQRコードを表示し、確認のため認証コードを入力させる
      return (
        <div className="flex flex-col gap-3">
          <p>1. {t('auth.totp.setup.installAuthenticator')}</p>
          <p>2. {t('auth.totp.setup.scanQrCode')}</p>
          <div className="h-auto mx-auto max-w-64 w-full">
            <QRCode
              size={256}
              style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
              value={totpURI}
              viewBox={`0 0 256 256`}
            />
          </div>
          <p>3. {t('auth.totp.setup.enterCode')}</p>
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
      <h2 className="text-xl font-bold">{t('auth.totp.setup.title')}</h2>
      {renderContent()}
    </AuthLayout>
  )
}
