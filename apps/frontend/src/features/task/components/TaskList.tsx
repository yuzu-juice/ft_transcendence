import { useState } from 'react'
import { TaskModal } from './TaskModal'
import { TaskListItem } from './TaskListItem'
import type { Task } from '../api'
import { Card } from 'otsukimi-ui'

interface TaskListProps {
  tasks: Task[]
}

export const TaskList = ({ tasks }: TaskListProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  return (
    <>
      <Card className="flex flex-col gap-6 w-full overflow-x-auto">
        {tasks.length === 0 ? (
          <div className="w-full flex justify-center">
            <h2 className="font-bold text-2xl">指定された条件を満たすタスクは存在しません</h2>
          </div>
        ) : (
          <table className="w-full table-auto text-left">
            <thead className="bg-purple-50 border-b border-brand-primary">
              <tr>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  タスク名
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  ステータス
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                  優先度
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap">
                  締切
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                  作成者
                </th>
                <th scope="col" className="px-4 py-3 whitespace-nowrap min-w-24">
                  担当者
                </th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  onModalOpen={() => setSelectedTaskId(task.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {selectedTaskId && (
        <TaskModal
          taskId={selectedTaskId}
          open
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTaskId(null)
            }
          }}
        />
      )}
    </>
  )
}
