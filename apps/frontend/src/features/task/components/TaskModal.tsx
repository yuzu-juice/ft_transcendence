import { Modal } from '@/components/ui/Modal'
import { useEffect, useState } from 'react'
import { TaskDetail } from './TaskDetail'

interface TaskModalProps {
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TaskModal = ({ taskId, open, onOpenChange }: TaskModalProps) => {
  const [view, setView] = useState<'detail' | 'edit'>('detail')

  // taskIdやopenの状態が変更された場合はdetail画面を表示する
  useEffect(() => {
    setView('detail')
  }, [taskId, open])

  if (view === 'edit') {
    return (
      <Modal
        title="タスクを編集"
        open={open}
        onOpenChange={onOpenChange}
        showCloseButton={false}
        dismissible={false}
      >
        編集
      </Modal>
    )
  }

  // 読み込み・エラーUIを作る
  return (
    <Modal
      title="タスク詳細"
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={true}
      dismissible={true}
    >
      <TaskDetail
        onEdit={() => {
          setView('detail')
        }}
        taskId={taskId}
      />
    </Modal>
  )
}
