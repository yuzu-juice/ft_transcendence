import { Link, type LinkOptions, type RegisteredRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { authClient } from '@/lib/auth/client'

const pages: {
  path: LinkOptions<RegisteredRouter>['to']
  nameKey: string
  admin: boolean
}[] = [
  {
    path: '/tasks',
    nameKey: 'user.pageList.tasks',
    admin: false,
  },
  {
    path: '/analytics',
    nameKey: 'user.pageList.analytics',
    admin: false,
  },
  {
    path: '/api-keys',
    nameKey: 'user.pageList.apiKeys',
    admin: false,
  },
  {
    path: '/admin',
    nameKey: 'user.pageList.admin',
    admin: true,
  },
]

export const PageList = () => {
  const { t } = useTranslation()
  const { data: session } = authClient.useSession()

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-heading font-bold">{t('user.pageList.title')}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {pages.map((page) => {
          if (page.admin && session && session.user.role !== 'admin') {
            return null
          }
          return (
            <Link
              to={page.path}
              key={page.path}
              className="bg-white rounded-sm shadow-md px-4 py-6 text-center font-bold hover:-translate-y-0.5 transition-all duration-300"
            >
              {t(page.nameKey)}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
