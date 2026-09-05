import type { ReactNode } from 'react'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { Badge, Button } from 'otsukimi-ui'
import type { User } from '../api'
import { formatTaskDateTime } from '@/features/task/time' // TODO: 広範囲のlibにする
import { authClient } from '@/lib/auth/client'
import { useMutation } from '@tanstack/react-query'
import { adminMutations } from '../mutation'
import { toast } from 'sonner'

interface TaskDetailProps {
  user: User
  onEdit: (page: 'edit' | 'edit-role') => void
  onClose: () => void
}

const UserDetailListItem = ({ heading, children }: { heading: string; children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-1">
      <h4 className="text-sm text-brand-primary font-bold">{heading}</h4>
      {children}
    </div>
  )
}

export const UserDetail = ({ user, onEdit, onClose }: TaskDetailProps) => {
  const { data: session } = authClient.useSession()

  const adminUserDeleteMutation = useMutation(adminMutations.delete())
  const handleDeleteUser = async () => {
    await adminUserDeleteMutation.mutateAsync(user.id)
    toast.success('ユーザを削除しました')
    onClose()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <UserAvatar
          userId={user.id}
          avatarUrl={user.image}
          alt={`${user.name}のアバター`}
          className="size-16 shrink-0 rounded-xs"
        />
        <UserDetailListItem heading="ユーザID">{user.id}</UserDetailListItem>
        <UserDetailListItem heading="ユーザ名">{user.name}</UserDetailListItem>
        <UserDetailListItem heading="メールアドレス">{user.email}</UserDetailListItem>
        <UserDetailListItem heading="ロール">
          <Badge className="w-fit" variant={user.role === 'admin' ? 'default' : 'moonlight'}>
            {user.role}
          </Badge>
        </UserDetailListItem>
        <div className="flex flex-wrap gap-5">
          <UserDetailListItem heading="作成日時">
            {formatTaskDateTime(user.createdAt)}
          </UserDetailListItem>
          <UserDetailListItem heading="最終更新日時">
            {formatTaskDateTime(user.updatedAt)}
          </UserDetailListItem>
        </div>
      </div>
      {session?.user.id !== user.id ? (
        <div className="flex flex-row flex-wrap gap-4">
          <Button type="button" onClick={() => onEdit('edit')}>
            ユーザ情報を編集
          </Button>
          <Button type="button" onClick={() => onEdit('edit-role')}>
            ロールを編集
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleDeleteUser()
            }}
            variant="transparent"
          >
            {adminUserDeleteMutation.isPending ? '削除しています...' : 'ユーザを削除'}
          </Button>
        </div>
      ) : (
        <p className="text-brand-primary-deep font-bold">
          自分自身の情報を操作することはできません
        </p>
      )}
    </div>
  )
}
