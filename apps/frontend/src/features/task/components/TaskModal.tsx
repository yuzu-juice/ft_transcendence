import { Modal } from '@/components/ui/Modal'
import { useState } from 'react'
import { TaskDetail } from './TaskDetail'
import { TaskEditInfo } from './TaskEditInfo'
import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { TaskEditAssignees } from './TaskEditAssignees'

interface TaskModalProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TaskModal = ({ taskId, open, onOpenChange }: TaskModalProps) => {
  const [view, setView] = useState<'detail' | 'edit' | 'edit-assignees'>('detail')

  const { data: task, error, isLoading, isSuccess } = useQuery(taskQueries.get(taskId))

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return <ErrorMessage error={error} />
  }

  if (view === 'edit') {
    return (
      <Modal
        title="タスクを編集"
        open={open}
        onOpenChange={onOpenChange}
        showCloseButton={false}
        dismissible={false}
      >
        <TaskEditInfo
          task={task}
          onBack={() => {
            setView('detail')
          }}
        />
      </Modal>
    )
  }

  if (view === 'edit-assignees') {
    return (
      <Modal
        title="担当者を編集"
        open={open}
        onOpenChange={onOpenChange}
        showCloseButton={false}
        dismissible={false}
      >
        <TaskEditAssignees
          task={task}
          onBack={() => {
            setView('detail')
          }}
        />
      </Modal>
    )
  }

  return (
    <Modal
      title="タスク詳細"
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={true}
      dismissible={true}
    >
      <TaskDetail
        onEdit={(page: 'edit' | 'edit-assignees') => {
          setView(page)
        }}
        task={task}
      />
    </Modal>
  )
}
