import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { Loading } from '@/components/ui/Loading'
import type { ReactNode } from 'react'
import { TaskPriorityBatch } from './TaskPriorityBatch'
import { TaskStatusBatch } from './TaskStatusBatch'
import { UserAvatar } from '@/components/ui/UserAvatar'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface TaskDetailProps {
  taskId: string
  onEdit: () => void
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
    } else if (diff == 0) {
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

export const TaskDetail = ({ taskId, onEdit }: TaskDetailProps) => {
  const { data, error, isSuccess, isPending } = useQuery(taskQueries.get(taskId))

  if (isPending) {
    return <Loading />
  }

  if (!isSuccess) {
    return <ErrorMessage error={error} />
  }

  return (
    <div className="flex flex-col gap-6">
      <TaskDetailListItem>
        <TaskDetailHeading title="タイトル" />
        {data.title}
      </TaskDetailListItem>
      <TaskDetailListItem>
        <TaskDetailHeading title="概要" />
        {data.description}
      </TaskDetailListItem>
      <div className="flex flex-wrap gap-5">
        <TaskDetailListItem>
          <TaskDetailHeading title="ステータス" />
          <TaskStatusBatch status={data.status} />
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title="優先度" />
          {data.priority ? <TaskPriorityBatch priority={data.priority} /> : '未設定'}
        </TaskDetailListItem>
      </div>
      <TaskDetailListItem>
        <TaskDetailHeading title="締切" />
        {data.dueAt ? <TaskDetailDueAt dueAt={new Date(data.dueAt)} /> : '未設定'}
      </TaskDetailListItem>
      <TaskDetailListItem>
        <TaskDetailHeading title="担当者" />
        <div className="flex flex-row flex-wrap gap-5">
          {data.assignees.length > 0
            ? data.assignees.map((assignee) => (
                <div className="flex flex-row gap-1.5 flex-nowrap items-center">
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
        {data.creator ? (
          <div className="flex flex-row gap-1.5 flex-nowrap items-center">
            <UserAvatar
              key={data.creator.id}
              userId={data.creator.id}
              avatarUrl={data.creator.image}
              alt={`${data.creator.name}のアバター`}
              className="size-8 rounded-xs"
            />
            {data.creator.name}
          </div>
        ) : (
          '削除されたユーザ'
        )}
      </TaskDetailListItem>
      <div className="flex flex-wrap gap-5">
        <TaskDetailListItem>
          <TaskDetailHeading title="作成日時" />
          {new Date(data.createdAt).toLocaleString()}
        </TaskDetailListItem>
        <TaskDetailListItem>
          <TaskDetailHeading title="最終更新日時" />
          {new Date(data.updatedAt).toLocaleString()}
        </TaskDetailListItem>
      </div>
    </div>
  )
}
