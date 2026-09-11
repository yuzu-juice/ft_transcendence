import { useQuery } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import { Modal } from '@/components/ui/Modal'
import { taskQueries } from '../query'
import { TaskDetail } from './TaskDetail'
import { TaskEditAssignees } from './TaskEditAssignees'
import { TaskEditInfo } from './TaskEditInfo'

type TaskModalView = 'detail' | 'edit' | 'edit-assignees'

interface TaskModalProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TaskModal = ({ taskId, open, onOpenChange }: TaskModalProps) => {
  const { t } = useTranslation()
  const [view, setView] = useState<TaskModalView>('detail')
  const query = useQuery(taskQueries.detail(taskId))
  const viewConfig = {
    detail: {
      title: t('task.modal.detailTitle'),
      showCloseButton: true,
      dismissible: true,
    },
    edit: {
      title: t('task.modal.editTitle'),
      showCloseButton: false,
      dismissible: false,
    },
    'edit-assignees': {
      title: t('task.modal.editAssigneesTitle'),
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
              {query.isFetching ? t('task.actions.reloading') : t('task.actions.retry')}
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
