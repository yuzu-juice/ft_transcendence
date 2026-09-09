import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button, Divider } from 'otsukimi-ui'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { CustomLink } from '@/components/ui/CustomLink'
import { authClient } from '@/lib/auth/client'
import { getBetterAuthErrorMessage, signUpMutationOptions } from '../mutation'
import { SignUpSchema } from '../schema'
import { AuthErrorAlert } from './AuthErrorAlert'
import { AuthLayout } from './AuthLayout'
import { GitHubSignIn } from './GitHubSignIn'
import { FormErrorMessage } from '@/components/form/FormErrorMessage'

export const SignUpForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { refetch } = authClient.useSession()

  const signUpMutation = useMutation(signUpMutationOptions)

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    },
    validators: {
      onChange: SignUpSchema,
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signUpMutation.mutateAsync(value)
        await refetch()
        toast.info(t('auth.signUp.toastSuccess'))
        await navigate({
          to: '/mypage',
        })
      } catch {}
    },
  })

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">{t('auth.signUp.title')}</h2>
      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="name">
          {(field) => (
            <field.TextField
              label={t('auth.fields.name.label')}
              type="text"
              autoComplete="username"
              placeholder={t('auth.fields.name.placeholder')}
            />
          )}
        </form.AppField>

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
              autoComplete="new-password"
              placeholder={t('auth.fields.password.placeholder')}
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextField
              label={t('auth.fields.confirmPassword.label')}
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.fields.confirmPassword.placeholder')}
            />
          )}
        </form.AppField>

        <form.AppField name="agreement">
          {(field) => (
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <field.CheckboxField />

                <span className="text-sm">
                  <Trans
                    i18nKey="auth.signUp.agreementText"
                    components={{
                      terms: <Link to="/terms" className="underline" />,
                      privacy: <Link to="/privacy" className="underline" />,
                    }}
                  />
                </span>
              </div>

              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <FormErrorMessage error={field.state.meta.errors[0]} />
              )}
            </div>
          )}
        </form.AppField>

        {signUpMutation.isError && (
          <AuthErrorAlert message={getBetterAuthErrorMessage(signUpMutation.error)} />
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('auth.signUp.submitting') : t('auth.signUp.submit')}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <Divider />
      <div className="flex flex-col">
        <GitHubSignIn />
      </div>
      <div className="flex flex-row gap-2">
        {t('auth.signUp.hasAccount')}
        <CustomLink to="/sign-in">{t('auth.signIn.title')}</CustomLink>
      </div>
    </AuthLayout>
  )
}
