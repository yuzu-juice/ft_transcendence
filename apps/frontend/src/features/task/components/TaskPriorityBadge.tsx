import type { TaskListItem } from '../api'

interface TaskPriorityBadgeProps {
  priority: TaskListItem['priority']
}

const PriorityToColor = (priority: TaskListItem['priority']) => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100'
    case 'medium':
      return 'bg-orange-100'
    case 'high':
      return 'bg-red-100'
  }
}

export const TaskPriorityBadge = ({ priority }: TaskPriorityBadgeProps) => {
  return (
    <div className={`${PriorityToColor(priority)} w-fit px-2 py-0.5 rounded-md`}>{priority}</div>
  )
}
