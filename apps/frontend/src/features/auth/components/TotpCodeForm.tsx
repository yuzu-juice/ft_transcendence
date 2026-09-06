import { Button } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'
import { useAppForm } from '@/components/form/form'
import { TotpCodeSchema } from '../schema'
import { AuthErrorAlert } from './AuthErrorAlert'

interface TotpCodeProps {
  onSubmit: (code: string) => Promise<void>
  errorMessage?: string
  isPending?: boolean
}

export const TotpCodeForm = ({ onSubmit, errorMessage, isPending }: TotpCodeProps) => {
  const { t } = useTranslation()
  const form = useAppForm({
    defaultValues: {
      code: '',
    },
    validators: {
      onSubmit: TotpCodeSchema,
      onChange: TotpCodeSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await onSubmit(value.code)
      } catch {
        // エラー表示は親の mutation.error に任せる
      }
    },
  })

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.AppField name="code">
        {(field) => (
          <field.TextField
            label={t('auth.fields.totpCode.label')}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
          />
        )}
      </form.AppField>

      {errorMessage && <AuthErrorAlert message={errorMessage} />}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t('auth.totp.code.confirming') : t('auth.totp.code.confirm')}
      </Button>
    </form>
  )
}
