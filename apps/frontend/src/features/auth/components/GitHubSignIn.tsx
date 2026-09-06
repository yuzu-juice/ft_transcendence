import { authClient } from '@/lib/auth/client'
import { Link } from '@tanstack/react-router'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'

// TOOD: i18n
// sign-in/sign-upに関わらず同一の動線としてGitHubSignInを使用する
// エラーメッセージを表示する場合は、全て/sign-in側に遷移する
export const GitHubSignIn = () => {
  const handleGitHubSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/mypage',
      errorCallbackURL: '/sign-in?oauth=github',
    })

    if (error) {
      // GitHubに移る前にBetter Auth側で何らかのエラーが発生した場合
      toast.error('GitHubでのログインを開始できませんでした')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button onClick={handleGitHubSignIn}>GitHubで続行</Button>
      <p className="text-xs">
        「GitHubで続行」をクリックすることで、当サイトの
        <Link to="/terms">利用規約</Link>
        および
        <Link to="/privacy">プライバシーポリシー</Link>
        に同意したものとみなします。
      </p>
    </div>
  )
}
