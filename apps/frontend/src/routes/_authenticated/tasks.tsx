import { TaskList } from '@/features/task/components/TaskList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TaskList,
})
