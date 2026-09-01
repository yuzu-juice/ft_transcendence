import { TaskPage } from '@/features/task/components/TaskPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tasks')({
  component: TaskPage,
})
