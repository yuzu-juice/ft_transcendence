import { Button } from 'otsukimi-ui'
import type { Task } from '../api'

interface TaskEditAssigneesProps {
  task: Task
  onBack: () => void
}

// TODO: タスク担当者編集UI
export const TaskEditAssignees = ({ task, onBack }: TaskEditAssigneesProps) => {
  return (
    <>
      <Button type="button" onClick={() => onBack()} variant="transparent">
        キャンセル
      </Button>
    </>
  )
}
