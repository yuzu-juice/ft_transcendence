import { useState } from 'react'
import { TaskList } from './TaskList'
import { Button } from 'otsukimi-ui'
import { TaskCreateModal } from './TaskCreateModal'
import { TaskSearchForm } from './TaskSearchForm'

export const TaskPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center">
          <h2 className="text-2xl font-heading font-bold">タスク</h2>
          <Button onClick={() => setCreateModalOpen(true)} className="ml-auto">
            タスクを作成する
          </Button>
        </div>
        <TaskSearchForm />
        <TaskList />
      </div>
      <TaskCreateModal open={createModalOpen} handleOpenChange={setCreateModalOpen} />
    </>
  )
}
