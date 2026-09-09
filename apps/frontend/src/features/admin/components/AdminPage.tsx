import { UserList } from './UserList'
import { useTranslation } from 'react-i18next'

export const AdminPage = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center">
        <h2 className="text-2xl font-heading font-bold">{t('admin.title')}</h2>
      </div>
      <UserList />
    </div>
  )
}
