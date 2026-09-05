import type { ReactNode } from 'react'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { Button } from 'otsukimi-ui'
import type { Task } from '../api'
import { formatTaskDateTime, getRelativeDueTime } from '../time'
import { authClient } from '@/lib/auth/client'
import { useMutation } from '@tanstack/react-query'
import { taskMutations } from '../mutation'
import { toast } from 'sonner'

interface TaskDetailProps {
  task: Task
  onEdit: (page: 'edit' | 'edit-assignees') => void
  onClose: () => void
}

const TaskDetailListItem = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>
}

const TaskDetailHeading = ({ title }: { title: string }) => {
  return <h4 className="text-sm text-brand-primary font-bold">{title}</h4>
}

export const TaskDetail = ({ task, onEdit, onClose }: TaskDetailProps) => {
  const { data: session } = authClient.useSession()

  const taskDeleteMutation = useMutation(taskMutations.delete())
  const handleDeleteTask = async () => {
    await taskDeleteMutation.mutateAsync(task.id)
    toast.success('タスクを削除しました')
    onClose()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <TaskDetailListItem>
          <TaskDetailHeading title="タイトル" />
          {task.title}
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title="概要" />
          {task.description}
        </TaskDetailListItem>
        <div className="flex flex-wrap gap-5">
          <TaskDetailListItem>
            <TaskDetailHeading title="ステータス" />
            <TaskStatusBadge status={task.status} />
          </TaskDetailListItem>
          <TaskDetailListItem>
            <TaskDetailHeading title="優先度" />
            {task.priority ? <TaskPriorityBadge priority={task.priority} /> : '未設定'}
          </TaskDetailListItem>
        </div>
        <TaskDetailListItem>
          <TaskDetailHeading title="締切" />
          {task.dueAt ? (
            <>
              {formatTaskDateTime(task.dueAt)} ({getRelativeDueTime(task.dueAt)})
            </>
          ) : (
            '未設定'
          )}
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title="担当者" />
          <div className="flex flex-row flex-wrap gap-5">
            {task.assignees.length > 0
              ? task.assignees.map((assignee) => (
                  <div key={assignee.id} className="flex flex-row gap-1.5 flex-nowrap items-center">
                    <UserAvatar
                      key={assignee.id}
                      userId={assignee.id}
                      avatarUrl={assignee.image}
                      alt={`${assignee.name}のアバター`}
                      className="size-8 rounded-xs"
                    />
                    {assignee.name}
                  </div>
                ))
              : '未設定'}
          </div>
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title="作成者" />
          {task.creator ? (
            <div className="flex flex-row gap-1.5 flex-nowrap items-center">
              <UserAvatar
                key={task.creator.id}
                userId={task.creator.id}
                avatarUrl={task.creator.image}
                alt={`${task.creator.name}のアバター`}
                className="size-8 rounded-xs"
              />
              {task.creator.name}
            </div>
          ) : (
            '削除されたユーザ'
          )}
        </TaskDetailListItem>
        <div className="flex flex-wrap gap-5">
          <TaskDetailListItem>
            <TaskDetailHeading title="作成日時" />
            {formatTaskDateTime(task.createdAt)}
          </TaskDetailListItem>
          <TaskDetailListItem>
            <TaskDetailHeading title="最終更新日時" />
            {formatTaskDateTime(task.updatedAt)}
          </TaskDetailListItem>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Button type="button" onClick={() => onEdit('edit')}>
          タスク情報を編集
        </Button>
        <Button type="button" onClick={() => onEdit('edit-assignees')}>
          担当者を編集
        </Button>
        {(session?.user.id === task.creator?.id || session?.user.role === 'admin') && (
          <Button type="button" onClick={() => handleDeleteTask()} variant="transparent">
            {taskDeleteMutation.isPending ? '削除しています...' : 'タスクを削除'}
          </Button>
        )}
      </div>
    </div>
  )
}
