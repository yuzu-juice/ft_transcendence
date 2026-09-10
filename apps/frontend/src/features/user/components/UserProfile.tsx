import { authClient } from '@/lib/auth/client'
import { Loading } from '@/components/ui/Loading'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { Badge, Button, Card } from 'otsukimi-ui'
import { useEffect, useState } from 'react'
import { AvatarEditModal } from './AvatarEditModal'
import { ProfileEditModal } from './ProfileEditModal'
import { CustomLink } from '@/components/ui/CustomLink'
import { useTranslation } from 'react-i18next'

export const UserProfile = () => {
  const { t } = useTranslation()
  const { data: session } = authClient.useSession()

  const [avatarEditOpen, setAvatarEditOpen] = useState(false)
  const [profileEditOpen, setProfileEditOpen] = useState(false)

  // Email・パスワード認証によりログインしているアカウントのみ2FAを有効化できるようにする
  const [hasCredential, setHasCredential] = useState<boolean>(false)

  useEffect(() => {
    void authClient.listAccounts().then(({ data }) => {
      setHasCredential(data?.some((account) => account.providerId === 'credential') ?? false)
    })
  }, [])

  if (!session) {
    return <Loading />
  }

  return (
    <>
      <Card>
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-start items-start">
          <div className="relative">
            <UserAvatar
              userId={session?.user.id}
              avatarUrl={session?.user.image}
              alt={t('user.profile.avatarAlt', { name: session.user.name })}
              className="mx-auto rounded-xs size-40"
            />
            <Button
              onClick={() => setAvatarEditOpen(true)}
              className="!min-w-fit !h-fit absolute bottom-0 -left-2 z-10 bg-white !px-2 !py-1 !rounded-xs !text-sm"
            >
              {t('user.profile.avatarEdit')}
            </Button>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex flex-row gap-3 items-center">
              <Badge
                className="w-fit"
                variant={session.user.role === 'admin' ? 'default' : 'moonlight'}
              >
                {session.user.role}
              </Badge>
              <h3 className="text-4xl font-bold font-heading mb-2">{session.user.name}</h3>
            </div>
            <p>email: {session.user.email}</p>
            {hasCredential && (
              <p>
                {t('user.profile.twoFactorLabel')}
                {session.user.twoFactorEnabled ? (
                  <span>{t('user.profile.twoFactorEnabled')}</span>
                ) : (
                  <span>
                    {t('user.profile.twoFactorDisabledPrefix')}
                    <CustomLink to="/totp">{t('user.profile.twoFactorEnableLink')}</CustomLink>
                    {t('user.profile.twoFactorDisabledSuffix')}
                  </span>
                )}
              </p>
            )}
          </div>
          <Button type="button" onClick={() => setProfileEditOpen(true)}>
            {t('user.profile.editProfile')}
          </Button>
        </div>
      </Card>
      <AvatarEditModal
        hasAvatarImage={!!session?.user.image}
        open={avatarEditOpen}
        onOpenChange={setAvatarEditOpen}
      />
      <ProfileEditModal
        name={session.user.name}
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </>
  )
}
