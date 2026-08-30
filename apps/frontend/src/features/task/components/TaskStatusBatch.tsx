interface TaskStatusBatchProps {
  status: 'todo' | 'in_progress' | 'done'
}

const StatusToColor = (status: 'todo' | 'in_progress' | 'done') => {
  switch (status) {
    case 'todo':
      return 'bg-fuchsia-100'
    case 'in_progress':
      return 'bg-yellow-100'
    case 'done':
      return 'bg-lime-100'
  }
}

export const TaskStatusBatch = ({ status }: TaskStatusBatchProps) => {
  return <div className={`${StatusToColor(status)} w-fit px-2 py-0.5 rounded-md`}>{status}</div>
}
