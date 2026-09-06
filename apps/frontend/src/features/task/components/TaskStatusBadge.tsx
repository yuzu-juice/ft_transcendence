import type { TaskListItem } from '../api'

interface TaskStatusBadgeProps {
  status: TaskListItem['status']
}

const StatusToColor = (status: TaskListItem['status']) => {
  switch (status) {
    case 'todo':
      return 'bg-fuchsia-100'
    case 'in_progress':
      return 'bg-yellow-100'
    case 'done':
      return 'bg-lime-100'
  }
}

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  return <div className={`${StatusToColor(status)} w-fit px-2 py-0.5 rounded-md`}>{status}</div>
}
