import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { TaskList } from './TaskList'
import { Pagination } from '@/components/ui/Pagination'
import { Button, Card } from 'otsukimi-ui'

export const TaskPage = () => {
  // TODO: タスク検索UI
  // TODO: search paramから検索条件を受け取り、検索UIのformと連携する
  // TODO: タスク作成UI

  const query = useQuery(taskQueries.list())

  // 仮の実装 ページの移動を行ってもTaskListの内容は変更されない
  const [page, setPage] = useState(1)

  return (
    <div className="flex flex-col gap-6">
      <Card>検索UI</Card>
      {query.isPending ? (
        <Loading />
      ) : !query.isSuccess ? (
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
              {query.isFetching ? '再読み込み中...' : '再試行'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 items-center">
          <TaskList tasks={query.data.data} />
          <Pagination
            current={page}
            totalPages={query.data.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
