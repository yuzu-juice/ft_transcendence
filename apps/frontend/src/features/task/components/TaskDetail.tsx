import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { authClient } from '@/lib/auth/client'
import { formatTaskDateTime, getRelativeDueTime } from '@/lib/utils/time'
import type { TaskDetail as TaskDetailResponse } from '../api'
import { taskMutations } from '../mutation'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'

interface TaskDetailProps {
  task: TaskDetailResponse
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
  const { t } = useTranslation()
  const { data: session } = authClient.useSession()

  const taskDeleteMutation = useMutation(taskMutations.delete())
  const handleDeleteTask = async () => {
    try {
      await taskDeleteMutation.mutateAsync(task.id)
      toast.success(t('task.deleted'))
      onClose()
    } catch {}
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <TaskDetailListItem>
          <TaskDetailHeading title={t('task.detail.title')} />
          {task.title}
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title={t('task.detail.description')} />
          {task.description}
        </TaskDetailListItem>
        <div className="flex flex-wrap gap-5">
          <TaskDetailListItem>
            <TaskDetailHeading title={t('task.detail.status')} />
            <TaskStatusBadge status={task.status} />
          </TaskDetailListItem>
          <TaskDetailListItem>
            <TaskDetailHeading title={t('task.detail.priority')} />
            {task.priority ? (
              <TaskPriorityBadge priority={task.priority} />
            ) : (
              t('task.detail.unset')
            )}
          </TaskDetailListItem>
        </div>
        <TaskDetailListItem>
          <TaskDetailHeading title={t('task.detail.dueAt')} />
          {task.dueAt ? (
            <>
              {formatTaskDateTime(task.dueAt)} ({getRelativeDueTime(task.dueAt)})
            </>
          ) : (
            t('task.detail.unset')
          )}
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title={t('task.detail.assignees')} />
          <div className="flex flex-row flex-wrap gap-5">
            {task.assignees.length > 0
              ? task.assignees.map((assignee) => (
                  <div key={assignee.id} className="flex flex-row gap-1.5 flex-nowrap items-center">
                    <UserAvatar
                      key={assignee.id}
                      userId={assignee.id}
                      avatarUrl={assignee.image}
                      alt={t('task.avatarAlt', { name: assignee.name })}
                      className="size-8 rounded-xs"
                    />
                    {assignee.name}
                  </div>
                ))
              : t('task.detail.unset')}
          </div>
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title={t('task.detail.creator')} />
          {task.creator ? (
            <div className="flex flex-row gap-1.5 flex-nowrap items-center">
              <UserAvatar
                key={task.creator.id}
                userId={task.creator.id}
                avatarUrl={task.creator.image}
                alt={t('task.avatarAlt', { name: task.creator.name })}
                className="size-8 rounded-xs"
              />
              {task.creator.name}
            </div>
          ) : (
            t('task.detail.deletedUser')
          )}
        </TaskDetailListItem>
        <div className="flex flex-wrap gap-5">
          <TaskDetailListItem>
            <TaskDetailHeading title={t('task.detail.createdAt')} />
            {formatTaskDateTime(task.createdAt)}
          </TaskDetailListItem>
          <TaskDetailListItem>
            <TaskDetailHeading title={t('task.detail.updatedAt')} />
            {formatTaskDateTime(task.updatedAt)}
          </TaskDetailListItem>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4">
        <Button type="button" onClick={() => onEdit('edit')}>
          {t('task.detail.editInfo')}
        </Button>
        <Button type="button" onClick={() => onEdit('edit-assignees')}>
          {t('task.detail.editAssignees')}
        </Button>
        {(session?.user.id === task.creator?.id || session?.user.role === 'admin') && (
          <Button
            type="button"
            onClick={() => handleDeleteTask()}
            variant="transparent"
            disabled={taskDeleteMutation.isPending}
          >
            {taskDeleteMutation.isPending ? t('task.actions.deleting') : t('task.actions.delete')}
          </Button>
        )}
      </div>
    </div>
  )
}
