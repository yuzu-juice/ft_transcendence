import { Link } from '@tanstack/react-router'
import { Button } from 'otsukimi-ui'
import { Trans, useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'

// sign-in/sign-upに関わらず同一の動線としてGitHubSignInを使用する
// エラーメッセージを表示する場合は、全て/sign-in側に遷移する
export const GitHubSignIn = () => {
  const { t } = useTranslation()

  const handleGitHubSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/mypage',
      errorCallbackURL: '/sign-in?oauth=github',
    })

    if (error) {
      // GitHubに移る前にBetter Auth側で何らかのエラーが発生した場合
      toast.error(t('auth.github.toastError'))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleGitHubSignIn}>{t('auth.github.title')}</Button>
      <p className="text-xs">
        <Trans
          i18nKey="auth.github.agreementText"
          components={{
            terms: <Link to="/terms" className="underline" />,
            privacy: <Link to="/privacy" className="underline" />,
          }}
        />
      </p>
    </div>
  )
}
