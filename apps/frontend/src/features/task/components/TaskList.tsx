import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Pagenation } from '@/components/ui/Pagenation'
import { useState } from 'react'
import { TaskModal } from './TaskModal'
import { TaskListItem } from './TaskListItem'

export const TaskList = () => {
  // task queryでタスク全権取得
  // タスク作成
  // タスク検索UI
  // search paramとformとqueryとschemaの連携
  // empty & error state
  // ユーザ検索UI
  // タスク詳細モーダル
  // タスク更新モーダル
  // 担当者割り当てモーダル
  // タスク削除モーダル
  // ページネーション
  // このコンポーネントは将来tasksの配列を受け取る、さらに上で検索uiとかwrapper uiを作る
  // 締め切りを過ぎている場合色つける

  // 上位（serach queryと検索UI・作成ボタン・pagenationを持つ）→TaskList（queryを受け取る・data表示 or pending or error）
  // TODO: error & empty stateの実装
  const { data, error, isPending, isSuccess } = useQuery(taskQueries.all())

  const [page, setPage] = useState(1)

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  // dataがundefinedでないか、task.size==0でないか
  // 長いタスク名があるとレイアウトが（とくにレスポンシブの時に）破綻するので、表示する上限を決めてもいいかも

  if (isPending) {
    return <Loading />
  }

  if (!isSuccess) {
    return <ErrorMessage error={error} />
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full px-6 py-8 overflow-x-auto bg-white rounded-lg shadow-lg">
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
            {data?.data.map((task) => (
              <TaskListItem task={task} onModalOpen={() => setSelectedTaskId(task.id)} />
            ))}
          </tbody>
        </table>
        <Pagenation current={page} totalPages={data?.meta.totalPages!} onPageChange={setPage} />
      </div>
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
