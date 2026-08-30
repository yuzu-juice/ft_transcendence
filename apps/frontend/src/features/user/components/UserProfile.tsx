import { authClient } from '@/lib/auth/client'
import { Loading } from '@/components/ui/Loading'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { Badge, Button, Card } from 'otsukimi-ui'
import { useState } from 'react'
import { AvatarEditModal } from './AvatarEditModal'
import { ProfileEditModal } from './ProfileEditModal'

export const UserProfile = () => {
  const { data: session } = authClient.useSession()

  const [avatarEditOpen, setAvatarEditOpen] = useState(false)
  const [profileEditOpen, setProfileEditOpen] = useState(false)

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
              alt={`${session.user.name}のアバター`}
              className="mx-auto rounded-xs size-40"
            />
            <Button
              onClick={() => setAvatarEditOpen(true)}
              className="!min-w-fit !h-fit absolute bottom-0 -left-2 z-10 bg-white !px-2 !py-1 !rounded-xs !text-sm"
            >
              編集
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
          </div>
          <Button type="button" onClick={() => setProfileEditOpen(true)}>
            プロフィールを編集
          </Button>
        </div>
      </Card>
      <AvatarEditModal open={avatarEditOpen} onOpenChange={setAvatarEditOpen} />
      <ProfileEditModal
        name={session.user.name}
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </>
  )
}
