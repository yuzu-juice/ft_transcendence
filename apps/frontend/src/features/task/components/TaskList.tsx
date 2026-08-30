import { useQuery } from '@tanstack/react-query'
import { taskQueries } from '../query'
import { Loading } from '@/components/ui/Loading'
import { Pagenation } from '@/components/ui/Pagenation'
import { useState } from 'react'
import { TaskStatusBatch } from './TaskStatusBatch'
import { TaskPriorityBatch } from './TaskPriorityBatch'
import { UserAvatar } from '@/components/ui/UserAvatar'

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

  // 上位（serach queryと検索UI・作成ボタン・pagenationを持つ）→TaskList（queryを受け取る・data表示 or pending or error）
  // TODO: error & empty stateの実装
  const { data, error, isPending, isError } = useQuery(taskQueries.all())

  const [page, setPage] = useState(1)

  // dataがundefinedでないか、task.size==0でないか
  return (
    <>
      {isPending ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-6 items-center w-full px-6 py-8 overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="w-full table-auto text-left">
            <thead className="bg-purple-50 border-b border-brand-primary">
              <tr>
                <th scope="col" className="px-4 py-3">
                  タスク名
                </th>
                <th scope="col" className="px-4 py-3">
                  ステータス
                </th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                  優先度
                </th>
                <th scope="col" className="px-4 py-3">
                  締切
                </th>
                <th scope="col" className="px-4 py-3 hidden sm:table-cell">
                  作成者
                </th>
                <th scope="col" className="px-4 py-3">
                  担当者
                </th>
                <th scope="col" className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((task) => (
                <tr key={task.id} className="border-b border-brand-primary-soft">
                  <td className="px-4 py-3 font-bold">{task.title}</td>
                  <td className="px-4 py-3">{<TaskStatusBatch status={task.status} />}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {task.priority ? <TaskPriorityBatch priority={task.priority} /> : ''}
                  </td>
                  <td className="px-4 py-3">
                    {task.dueAt ? new Date(task.dueAt).toLocaleDateString() : ''}
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
                  <td className="px-4 py-3 flex flex-row gap-1 items-center">
                    {
                      /* TODO: アイコンの高さが不揃いになるのを修正 */
                      /* TODO: 5名以上担当者がいる場合は省略かつ...のように書く */
                      task.assignees.map((assignee) => (
                        <UserAvatar
                          key={assignee.id}
                          userId={assignee.id}
                          avatarUrl={assignee.image}
                          alt={`${assignee.name}のアバター`}
                          className="size-8 rounded-xs"
                        />
                      ))
                    }
                  </td>
                  <td className="px-4 py-3">詳細</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagenation current={page} totalPages={data?.meta.totalPages!} onPageChange={setPage} />
        </div>
      )}
    </>
  )
}
