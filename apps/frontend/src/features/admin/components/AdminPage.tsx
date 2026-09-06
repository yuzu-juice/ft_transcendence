import { UserList } from './UserList'

export const AdminPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center">
        <h2 className="text-2xl font-heading font-bold">管理画面</h2>
      </div>
      <UserList />
    </div>
  )
}
