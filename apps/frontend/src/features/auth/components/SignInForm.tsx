import { CustomLink } from '@/components/ui/CustomLink'
import { AuthLayout } from './AuthLayout'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useAppForm } from '@/components/form/form'
import { SignInSchema } from '../schema'
import { getBetterAuthErrorMessage, signInMutationOptions } from '../mutation'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'
import { AuthErrorAlert } from './AuthErrorAlert'
import { useTranslation } from 'react-i18next'

export const SignInForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const router = useRouter()
  const { refetch } = authClient.useSession()

  const signInMutation = useMutation(signInMutationOptions)

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: SignInSchema,
      onSubmit: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signInMutation.mutateAsync(value)
        await refetch()
        // _authenticatedで使用しているbeforeLoadを再評価する
        await router.invalidate()
        toast.info(t('auth.signIn.toastSuccess'))
        await navigate({
          to: '/mypage',
        })
      } catch {}
    },
  })

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">{t('auth.signIn.title')}</h2>
      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label={t('auth.fields.email.label')}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t('auth.fields.email.placeholder')}
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label={t('auth.fields.password.label')}
              type="password"
              autoComplete="current-password"
              placeholder={t('auth.fields.password.placeholder')}
            />
          )}
        </form.AppField>

        {signInMutation.isError && (
          <AuthErrorAlert message={getBetterAuthErrorMessage(signInMutation.error)} />
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('auth.signIn.submitting') : t('auth.signIn.submit')}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <div className="flex flex-row gap-2">
        {t('auth.signIn.noAccount')}
        <CustomLink to="/sign-up">{t('auth.signUp.title')}</CustomLink>
      </div>
    </AuthLayout>
  )
}
