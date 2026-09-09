// いい感じにプロフィール画像は抽象化する（サイズとlink, useridを渡せるようにする）

import { authClient } from '@/lib/auth/client'
import { UserAvatar } from './UserAvatar'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t } = useTranslation()
  const { data: session } = authClient.useSession()
  const navigate = useNavigate()
  return (
    <header className="w-full h-14 bg-white shadow-md flex items-center px-6">
      <h1 className="text-brand-primary text-2xl font-bold">
        <Link to="/mypage">LunaPhase</Link>
      </h1>
      <div className="flex-1" />
      {session?.user ? (
        <UserAvatar
          userId={session?.user.id}
          avatarUrl={session?.user.image}
          alt={t('user.profile.avatarAlt', { name: session.user.name })}
          className="mx-auto rounded-xs size-10"
          onClick={() =>
            navigate({
              to: '/mypage',
            })
          }
        />
      ) : (
        <Link to="/sign-in" className="text-sm text-blue-700">
          {t('auth.signIn.submit')}
        </Link>
      )}
    </header>
  )
}
