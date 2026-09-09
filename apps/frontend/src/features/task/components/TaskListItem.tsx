import { UserAvatar } from '@/components/ui/UserAvatar'
import type { TaskListItem as TaskListItemResponse } from '../api'
import { formatTaskDate, isOverDue } from '../time'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { TaskStatusBadge } from './TaskStatusBadge'
import { useTranslation } from 'react-i18next'

interface TaskListItemProps {
  task: TaskListItemResponse
  onModalOpen: () => void
}

export const TaskListItem = ({ task, onModalOpen }: TaskListItemProps) => {
  const { t } = useTranslation()
  // レスポンシブUIを考慮し、担当者の数の表示には限度を設けている
  const visibleAssignees = task.assignees.slice(0, 2)
  const remainingAssignees = task.assignees.length - visibleAssignees.length

  return (
    <tr key={task.id} className="border-b border-brand-primary-soft">
      <td className="px-4 py-3 font-bold">
        <div
          className="max-w-48 truncate md:max-w-64 lg:max-w-80 xl:max-w-md 2xl:max-w-lg"
          title={task.title}
        >
          {task.title}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">{<TaskStatusBadge status={task.status} />}</td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {task.priority ? <TaskPriorityBadge priority={task.priority} /> : ''}
      </td>
      <td
        className={`px-4 py-3 whitespace-nowrap ${task.dueAt && isOverDue(task.dueAt) && 'text-pink-600'}`}
      >
        {task.dueAt ? formatTaskDate(task.dueAt) : ''}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {task.creator ? (
          <UserAvatar
            userId={task.creator.id}
            avatarUrl={task.creator.image}
            alt={t('task.avatarAlt', { name: task.creator.name })}
            className="size-8 rounded-xs"
          />
        ) : (
          ''
        )}
      </td>
      <td className="px-4 py-3 min-w-24">
        <div className="flex flex-row gap-1 items-center">
          {visibleAssignees.map((assignee) => (
            <UserAvatar
              key={assignee.id}
              userId={assignee.id}
              avatarUrl={assignee.image}
              alt={t('task.avatarAlt', { name: assignee.name })}
              className="size-8 shrink-0 rounded-xs"
            />
          ))}
          {remainingAssignees > 0 && <span>+{remainingAssignees}</span>}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          type="button"
          className="text-cyan-600 cursor-pointer hover:underline hover:text-cyan-700 transition duration-300 "
          onClick={() => onModalOpen()}
          aria-label={t('task.list.detailAria', { title: task.title })}
        >
          {t('task.list.detail')}
        </button>
      </td>
    </tr>
  )
}
