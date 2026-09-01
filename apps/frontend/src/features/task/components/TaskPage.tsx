import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { TaskList } from './TaskList'
import { Pagenation } from '@/components/ui/Pagenation'
import { Card } from 'otsukimi-ui'

export const TaskPage = () => {
  // TODO: タスク検索UI
  // TODO: search paramから検索条件を受け取り、検索UIのformと連携する
  // TODO: タスク作成UI

  const query = useQuery(taskQueries.all())

  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col gap-6">
      <Card>検索UI</Card>
      {query.isPending ? (
        <Loading />
      ) : !query.isSuccess ? (
        <ErrorMessage error={query.error} />
      ) : (
        <div className="flex flex-col gap-6 items-center">
          <TaskList tasks={query.data.data} />
          <Pagenation
            current={page}
            totalPages={query.data.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
