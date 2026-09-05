import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { adminQueries } from '../query'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Button } from 'otsukimi-ui'
import { Modal } from '@/components/ui/Modal'
import { UserDetail } from './UserDetail'
import { UserEditInfo } from './UserEditInfo'
import { UserEditRoleInfo } from './UserEditRole'

interface UserModalProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UserModalView = 'detail' | 'edit' | 'edit-role'

const viewConfig = {
  detail: {
    title: 'ユーザ詳細',
    showCloseButton: true,
    dismissible: true,
  },
  edit: {
    title: 'ユーザ情報を編集',
    showCloseButton: false,
    dismissible: false,
  },
  'edit-role': {
    title: 'ユーザのロールを編集',
    showCloseButton: false,
    dismissible: false,
  },
} satisfies Record<
  UserModalView,
  {
    title: string
    showCloseButton: boolean
    dismissible: boolean
  }
>

export const UserModal = ({ userId, open, onOpenChange }: UserModalProps) => {
  const [view, setView] = useState<UserModalView>('detail')
  const query = useQuery(adminQueries.detail(userId))
  const config = viewConfig[view]

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // 次回開いた時に編集画面が残存しないようにする
      setView('detail')
    }
    onOpenChange(nextOpen)
  }

  const renderContent = () => {
    if (query.isLoading) {
      return <Loading />
    }

    if (!query.isSuccess) {
      return (
        <div className="flex flex-col gap-4">
          <ErrorMessage error={query.error} />
          <div className="flex justify-center">
            <Button
              type="button"
              disabled={query.isFetching}
              onClick={() => {
                query.refetch()
              }}
            >
              {query.isFetching ? '再読み込み中...' : '再試行'}
            </Button>
          </div>
        </div>
      )
    }

    switch (view) {
      case 'detail':
        return (
          <UserDetail
            user={query.data}
            onEdit={(nextView) => {
              setView(nextView)
            }}
            onClose={() => onOpenChange(false)}
          />
        )

      case 'edit':
        return <UserEditInfo user={query.data} onBack={() => setView('detail')} />

      case 'edit-role':
        return <UserEditRoleInfo user={query.data} onBack={() => setView('detail')} />
    }
  }

  return (
    <Modal
      title={config.title}
      open={open}
      onOpenChange={handleOpenChange}
      showCloseButton={config.showCloseButton}
      dismissible={config.dismissible}
    >
      {renderContent()}
    </Modal>
  )
}
