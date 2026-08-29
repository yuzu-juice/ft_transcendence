import { authClient } from '@/lib/auth/client'
import { Link } from '@tanstack/react-router'

const pages = [
  {
    path: '/tasks',
    name: 'タスク',
    admin: false,
  },
  {
    path: '/analytics',
    name: 'アナリティクス',
    admin: false,
  },
  {
    path: '/admin',
    name: '管理画面',
    admin: true,
  },
]

export const PageList = () => {
  const { data: session } = authClient.useSession()

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-heading font-bold">コンテンツ一覧</h3>
      <div className="grid grid-cols-3 gap-4">
        {pages.map((page) => {
          if (page.admin && session && session.user.role !== 'admin') {
            return null
          }
          return (
            <Link
              to={page.path}
              key={page.path}
              className="bg-white p-4 flex items-center border-2 border-brand-primary rounded-sm shadow-sm"
            >
              {page.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
