import type { ReactNode } from 'react'
import { TaskPriorityBatch } from './TaskPriorityBatch'
import { TaskStatusBatch } from './TaskStatusBatch'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { Button } from 'otsukimi-ui'
import type { Task } from '../api'

interface TaskDetailProps {
  task: Task
  onEdit: (page: 'edit' | 'edit-assignees') => void
}

const TaskDetailListItem = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>
}

const TaskDetailHeading = ({ title }: { title: string }) => {
  return <h4 className="text-sm text-brand-primary font-bold">{title}</h4>
}

const TaskDetailDueAt = ({ dueAt }: { dueAt: Date }) => {
  const getDaysDiff = () => {
    const currentDate = new Date()
    const dueDate = new Date(dueAt)

    // 時刻を全て 00:00:00.000にリセットし、純粋な日付にする
    currentDate.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    const msPerDay = 1000 * 60 * 60 * 24
    const diffMs = dueDate.getTime() - currentDate.getTime()

    // 夏時間による1時間のずれなども吸収できる
    return Math.round(diffMs / msPerDay)
  }

  const getHourDiff = () => {
    const currentHour = new Date()
    const dueHour = new Date(dueAt)

    currentHour.setMinutes(0, 0, 0)
    dueHour.setMinutes(0, 0, 0)

    const msPerHour = 1000 * 60 * 60
    const diffMs = currentHour.getTime() - dueHour.getTime()

    return Math.round(diffMs / msPerHour)
  }

  const getDueDateStatus = () => {
    const diff = getDaysDiff()

    if (diff > 0) {
      return `${diff}日後`
    } else if (diff === 0) {
      const now = new Date()
      if (now > dueAt) {
        return `${-getHourDiff()}時間前`
      } else {
        return `${-getHourDiff()}時間後`
      }
    } else {
      return `${-diff}日前`
    }
  }

  return (
    <p>
      {dueAt.toLocaleString()}（{getDueDateStatus()}）
    </p>
  )
}

export const TaskDetail = ({ task, onEdit }: TaskDetailProps) => {
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
            <TaskStatusBatch status={task.status} />
          </TaskDetailListItem>
          <TaskDetailListItem>
            <TaskDetailHeading title="優先度" />
            {task.priority ? <TaskPriorityBatch priority={task.priority} /> : '未設定'}
          </TaskDetailListItem>
        </div>
        <TaskDetailListItem>
          <TaskDetailHeading title="締切" />
          {task.dueAt ? <TaskDetailDueAt dueAt={new Date(task.dueAt)} /> : '未設定'}
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
            {new Date(task.createdAt).toLocaleString()}
          </TaskDetailListItem>
          <TaskDetailListItem>
            <TaskDetailHeading title="最終更新日時" />
            {new Date(task.updatedAt).toLocaleString()}
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
        <Button type="button" onClick={() => {}} variant="transparent">
          タスクを削除
        </Button>
      </div>
    </div>
  )
}
