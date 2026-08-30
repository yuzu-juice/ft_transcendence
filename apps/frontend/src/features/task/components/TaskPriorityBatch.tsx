interface TaskPriorityBatchProps {
  priority: 'low' | 'medium' | 'high'
}

const PriorityToColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low':
      return 'bg-blue-100'
    case 'medium':
      return 'bg-orange-100'
    case 'high':
      return 'bg-red-100'
  }
}

export const TaskPriorityBatch = ({ priority }: TaskPriorityBatchProps) => {
  return (
    <div className={`${PriorityToColor(priority)} w-fit px-2 py-0.5 rounded-md`}>{priority}</div>
  )
}
