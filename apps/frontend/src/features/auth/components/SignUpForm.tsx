import { CustomLink } from '@/components/ui/CustomLink'
import { AuthLayout } from './AuthLayout'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useAppForm } from '@/components/form/form'
import { SignUpSchema } from '../schema'
import { getBetterAuthErrorMessage, signUpMutationOptions } from '../mutation'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'

export const SignUpForm = () => {
  const navigate = useNavigate()
  const router = useRouter()
  const { refetch } = authClient.useSession()

  const signUpMutation = useMutation(signUpMutationOptions)

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onBlur: SignUpSchema,
      onSubmit: SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await signUpMutation.mutateAsync(value)
        await refetch()
        // _authenticatedで使用しているbeforeLoadを再評価する
        await router.invalidate()
        toast.info('サインアップしました')
        await navigate({
          to: '/',
        })
      } catch {}
    },
  })

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">サインアップ</h2>
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
              label="ユーザ名"
              type="text"
              autoComplete="username"
              placeholder="ユーザ名"
            />
          )}
        </form.AppField>

        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="メールアドレス"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="example@example.com"
            />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="パスワード"
              type="password"
              autoComplete="new-password"
              placeholder="パスワード"
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.TextField
              label="確認用パスワード"
              type="password"
              autoComplete="new-password"
              placeholder="確認用パスワード"
            />
          )}
        </form.AppField>

        {signUpMutation.isError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {getBetterAuthErrorMessage(signUpMutation.error)}
          </p>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'サインアップしています...' : 'サインアップ'}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <div className="flex flex-row gap-2">
        登録済ですか?
        <CustomLink to="/sign-in">サインイン</CustomLink>
      </div>
    </AuthLayout>
  )
}
