import { Button } from 'otsukimi-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TaskCreateModal } from './TaskCreateModal'
import { TaskList } from './TaskList'
import { TaskSearchForm } from './TaskSearchForm'

export const TaskPage = () => {
  const { t } = useTranslation()
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row items-center gap-4">
          <h2 className="text-2xl font-heading font-bold">{t('task.title')}</h2>
          <Button onClick={() => setCreateModalOpen(true)} className="ml-auto">
            {t('task.actions.create')}
          </Button>
        </div>
        <TaskSearchForm />
        <TaskList />
      </div>
      <TaskCreateModal open={createModalOpen} handleOpenChange={setCreateModalOpen} />
    </>
  )
}
