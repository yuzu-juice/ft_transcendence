import { authClient } from '@/lib/auth/client'
import { Loading } from '@/components/ui/Loading'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { Badge, Button } from 'otsukimi-ui'
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
      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded-md shadow-md justify-start items-start">
        <div className="relative">
          <UserAvatar
            userId={session?.user.id}
            avatarUrl={session?.user.image}
            alt={`${session.user.name}のアバター`}
            className="mx-auto rounded-xs size-40"
          />
          <Button
            onClick={() => setAvatarEditOpen(true)}
            className="absolute bottom-0 -left-2 z-10 bg-white px-2 py-1 rounded-xs border border-brand-primary shadow-sm text-sm"
          >
            編集
          </Button>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-4xl font-bold font-heading">{session.user.name}</h3>
          <Badge>{session.user.role}</Badge>
          <p>email: {session.user.email}</p>
          <p>参加日: {session.user.createdAt.toLocaleDateString()}</p>
        </div>
        <Button type="button" onClick={() => setProfileEditOpen(true)}>
          プロフィールを編集
        </Button>
      </div>
      <AvatarEditModal open={avatarEditOpen} onOpenChange={setAvatarEditOpen} />
      <ProfileEditModal
        name={session.user.name}
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
      />
    </>
  )
}
