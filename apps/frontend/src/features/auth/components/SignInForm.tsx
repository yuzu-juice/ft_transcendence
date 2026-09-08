import { useMutation } from '@tanstack/react-query'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Divider } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { CustomLink } from '@/components/ui/CustomLink'
import { authClient } from '@/lib/auth/client'
import { getBetterAuthErrorMessage, getOAuthErrorMessage, signInMutationOptions } from '../mutation'
import { SignInSchema } from '../schema'
import { AuthErrorAlert } from './AuthErrorAlert'
import { AuthLayout } from './AuthLayout'
import { GitHubSignIn } from './GitHubSignIn'

const signInRoute = getRouteApi('/sign-in')

export const SignInForm = () => {
  const { t } = useTranslation()
  const search = signInRoute.useSearch()
  const navigate = useNavigate()
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
        const data = await signInMutation.mutateAsync(value)
        if ('twoFactorRedirect' in data && data.twoFactorRedirect) {
          return // Better Authが/totpへ遷移するので何もしない
        }

        await refetch()
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
      <Divider />
      <div className="flex flex-col gap-2">
        <GitHubSignIn />
        {search.error && <AuthErrorAlert message={getOAuthErrorMessage(search.error)} />}
      </div>
      <div className="flex flex-row gap-2">
        {t('auth.signIn.noAccount')}
        <CustomLink to="/sign-up">{t('auth.signUp.title')}</CustomLink>
      </div>
    </AuthLayout>
  )
}
