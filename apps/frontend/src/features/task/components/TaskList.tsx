import { useEffect, useState } from 'react'
import { TaskModal } from './TaskModal'
import { TaskListItem } from './TaskListItem'
import { Button, Card } from 'otsukimi-ui'
import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { Pagination } from '@/components/ui/Pagination'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const tasksRoute = getRouteApi('/_authenticated/tasks')

// URLのsearch paramsが検索条件を持つ
// TaskSearchForm内で検索ボタンが実行された場合、URLのsearch paramsを更新する
// このコンポーネントではsearch paramsを元にクエリを実行する
// 検索条件を変更すると、taskQueryKeys.list(search)に渡る値が変化することで
// query keyが変わるため、新しいapiリクエストが自動的に発行される
export const TaskList = () => {
  const { t } = useTranslation()
  const search = tasksRoute.useSearch()
  const navigate = tasksRoute.useNavigate()

  const query = useQuery(taskQueries.list(search))

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    if (query.data && query.data.meta.totalPages < query.data.meta.page) {
      navigate({
        search: (prev) => ({
          ...prev,
          page: 1,
        }),
      })
    }
  }, [navigate, query.data])

  const renderContent = () => {
    if (query.isPending) {
      return <Loading />
    }

    if (!query.isSuccess) {
      return (
        <div className="flex flex-col gap-4">
          <ErrorMessage error={query.error} />
          <div className="flex justify-center">
            <Button
              type="button"
              disabled={query.isFetching}
              onClick={() => {
                query.refetch()
              }}
            >
              {query.isFetching ? t('task.actions.reloading') : t('task.actions.retry')}
            </Button>
          </div>
        </div>
      )
    }

    if (query.data.data.length === 0) {
      return (
        <div className="w-full flex justify-center">
          <h2 className="font-bold text-2xl">{t('task.list.empty')}</h2>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-6">
        <table className="w-full table-auto text-left">
          <thead className="bg-purple-50 border-b border-brand-primary">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                {t('task.list.columns.taskName')}
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                {t('task.list.columns.status')}
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                {t('task.list.columns.priority')}
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                {t('task.list.columns.dueAt')}
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                {t('task.list.columns.creator')}
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap min-w-24">
                {t('task.list.columns.assignees')}
              </th>
              <th scope="col" className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {query.data.data.map((task) => (
              <TaskListItem
                key={task.id}
                task={task}
                onModalOpen={() => setSelectedTaskId(task.id)}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-center">
          <Pagination
            current={search.page}
            totalPages={query.data.meta.totalPages}
            onPageChange={(page) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  page,
                }),
              })
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="w-full overflow-x-auto">{renderContent()}</Card>
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
