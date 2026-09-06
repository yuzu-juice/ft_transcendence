import { useTranslation } from 'react-i18next'

interface AuthErrorAlertProps {
  message: string
}

export const AuthErrorAlert = ({ message }: AuthErrorAlertProps) => {
  const { t } = useTranslation()

  return (
    <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      <p className="font-bold">{t('auth.error.title')}</p>
      <p>{message}</p>
    </div>
  )
}
