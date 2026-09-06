import { useState } from 'react'
import { UserListItem } from './UserListItem'
import { Button, Card } from 'otsukimi-ui'
import { useQuery } from '@tanstack/react-query'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { adminQueries } from '../query'
import { UserModal } from './UserModal'

export const UserList = () => {
  const query = useQuery(adminQueries.users())

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

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
              {query.isFetching ? '再読み込み中...' : '再試行'}
            </Button>
          </div>
        </div>
      )
    }

    if (query.data.length === 0) {
      return (
        <div className="w-full flex justify-center">
          <h2 className="font-bold text-2xl">ユーザは存在しません</h2>
        </div>
      )
    }

    // TODO: GitHubアカウント or Email・Password方式のアカウントかを表記する
    // （同一のメールアドレスで複数アカウントを作成できるため）
    return (
      <div className="flex flex-col gap-6">
        <table className="w-full table-auto text-left">
          <thead className="bg-purple-50 border-b border-brand-primary">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap"></th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                ユーザ名
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                メールアドレス
              </th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">
                ロール
              </th>
              <th scope="col" className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {query.data.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                onModalOpen={() => setSelectedUserId(user.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <Card className="w-full overflow-x-auto">{renderContent()}</Card>
      {selectedUserId && (
        <UserModal
          userId={selectedUserId}
          open
          onOpenChange={(open) => {
            if (!open) {
              setSelectedUserId(null)
            }
          }}
        />
      )}
    </>
  )
}
