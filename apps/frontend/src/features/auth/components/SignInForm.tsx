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

export const SignInForm = () => {
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
        toast.info('サインインしました')
        await navigate({
          to: '/mypage',
        })
      } catch {}
    },
  })

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold">サインイン</h2>
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
              autoComplete="current-password"
              placeholder="パスワード"
            />
          )}
        </form.AppField>

        {signInMutation.isError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {getBetterAuthErrorMessage(signInMutation.error)}
          </p>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'サインインしています...' : 'サインイン'}
            </Button>
          )}
        </form.Subscribe>
      </form>
      <div className="flex flex-row gap-2">
        未登録ですか?
        <CustomLink to="/sign-up">サインアップ</CustomLink>
      </div>
    </AuthLayout>
  )
}
