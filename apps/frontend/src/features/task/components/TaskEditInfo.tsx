import { Button } from 'otsukimi-ui'
import type { Task } from '../api'

interface TaskEditInfoProps {
  task: Task
  onBack: () => void
}

// TODO: タスク編集UI
export const TaskEditInfo = ({ onBack }: TaskEditInfoProps) => {
  return (
    <>
      <Button type="button" onClick={() => onBack()} variant="transparent">
        キャンセル
      </Button>
    </>
  )
}
