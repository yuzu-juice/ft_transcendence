import { TaskStatusBadge } from './TaskStatusBadge'
import { TaskPriorityBadge } from './TaskPriorityBadge'
import { UserAvatar } from '@/components/ui/UserAvatar'
import type { Task } from '../api'
import { formatTaskDate, isOverDue } from '../time'

interface TaskListItemProps {
  task: Task
  onModalOpen: () => void
}

export const TaskListItem = ({ task, onModalOpen }: TaskListItemProps) => {
  // レスポンシブUIを考慮し、タイトルの文字数・担当者の数の表示には限度を設けている
  const visibleTitle = task.title.slice(0, 30)
  const remainingTitle = task.title.length - visibleTitle.length
  const visibleAssignees = task.assignees.slice(0, 2)
  const remainingAssignees = task.assignees.length - visibleAssignees.length

  return (
    <tr key={task.id} className="border-b border-brand-primary-soft">
      <td className="px-4 py-3 whitespace-nowrap font-bold">
        {visibleTitle}
        {remainingTitle > 0 ? '...' : ''}
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
            alt={`${task.creator.name}のアバター`}
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
              alt={`${assignee.name}のアバター`}
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
        >
          詳細
        </button>
      </td>
    </tr>
  )
}
