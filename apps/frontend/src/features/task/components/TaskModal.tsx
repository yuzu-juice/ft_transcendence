import { Modal } from '@/components/ui/Modal'
import { useState } from 'react'
import { TaskDetail } from './TaskDetail'
import { TaskEditInfo } from './TaskEditInfo'
import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { TaskEditAssignees } from './TaskEditAssignees'
import { Button } from 'otsukimi-ui'

type TaskModalView = 'detail' | 'edit' | 'edit-assignees'

interface TaskModalProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const viewConfig = {
  detail: {
    title: 'タスク詳細',
    showCloseButton: true,
    dismissible: true,
  },
  edit: {
    title: 'タスクを編集',
    showCloseButton: false,
    dismissible: false,
  },
  'edit-assignees': {
    title: '担当者を編集',
    showCloseButton: false,
    dismissible: false,
  },
} satisfies Record<
  TaskModalView,
  {
    title: string
    showCloseButton: boolean
    dismissible: boolean
  }
>

export const TaskModal = ({ taskId, open, onOpenChange }: TaskModalProps) => {
  const [view, setView] = useState<TaskModalView>('detail')
  const query = useQuery(taskQueries.detail(taskId))
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
          <TaskDetail
            task={query.data}
            onEdit={(nextView) => {
              setView(nextView)
            }}
            onClose={() => onOpenChange(false)}
          />
        )

      case 'edit':
        return (
          <TaskEditInfo
            task={query.data}
            onBack={() => {
              setView('detail')
            }}
          />
        )

      case 'edit-assignees':
        return (
          <TaskEditAssignees
            task={query.data}
            onBack={() => {
              setView('detail')
            }}
          />
        )
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
