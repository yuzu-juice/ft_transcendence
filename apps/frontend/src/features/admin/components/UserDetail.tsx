import { useMutation } from '@tanstack/react-query'
import { Badge, Button } from 'otsukimi-ui'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { formatTaskDateTime } from '@/features/task/time' // TODO: 広範囲のlibにする
import { authClient } from '@/lib/auth/client'
import type { AdminUserDetail } from '../api'
import { adminMutations } from '../mutation'

interface UserDetailProps {
  user: AdminUserDetail
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

export const UserDetail = ({ user, onEdit, onClose }: UserDetailProps) => {
  const { t } = useTranslation()
  const { data: session } = authClient.useSession()

  const adminUserDeleteMutation = useMutation(adminMutations.delete())
  const handleDeleteUser = async () => {
    await adminUserDeleteMutation.mutateAsync(user.id)
    toast.success(t('admin.deleted'))
    onClose()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <UserAvatar
          userId={user.id}
          avatarUrl={user.image}
          alt={t('admin.avatarAlt', { name: user.name })}
          className="size-16 shrink-0 rounded-xs"
        />
        <UserDetailListItem heading={t('admin.detail.userId')}>{user.id}</UserDetailListItem>
        <UserDetailListItem heading={t('admin.detail.userName')}>{user.name}</UserDetailListItem>
        <UserDetailListItem heading={t('admin.detail.email')}>{user.email}</UserDetailListItem>
        <UserDetailListItem heading={t('admin.detail.role')}>
          <Badge className="w-fit" variant={user.role === 'admin' ? 'default' : 'moonlight'}>
            {user.role}
          </Badge>
        </UserDetailListItem>
        <div className="flex flex-wrap gap-5">
          <UserDetailListItem heading={t('admin.detail.createdAt')}>
            {formatTaskDateTime(user.createdAt)}
          </UserDetailListItem>
          <UserDetailListItem heading={t('admin.detail.updatedAt')}>
            {formatTaskDateTime(user.updatedAt)}
          </UserDetailListItem>
        </div>
      </div>
      {session?.user.id !== user.id ? (
        <div className="flex flex-row flex-wrap gap-4">
          <Button type="button" onClick={() => onEdit('edit')}>
            {t('admin.detail.editInfo')}
          </Button>
          <Button type="button" onClick={() => onEdit('edit-role')}>
            {t('admin.detail.editRole')}
          </Button>
          <Button
            type="button"
            onClick={() => {
              handleDeleteUser()
            }}
            variant="transparent"
            disabled={adminUserDeleteMutation.isPending}
          >
            {adminUserDeleteMutation.isPending
              ? t('admin.actions.deleting')
              : t('admin.actions.delete')}
          </Button>
        </div>
      ) : (
        <p className="text-brand-primary-deep font-bold">{t('admin.detail.selfActionForbidden')}</p>
      )}
    </div>
  )
}
