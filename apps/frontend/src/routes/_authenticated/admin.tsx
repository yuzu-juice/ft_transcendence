import { AdminPage } from '@/features/admin/components/AdminPage'
import i18n from '@/lib/i18n/config'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'admin') {
      toast.error(i18n.t('admin.unauthorized'))
      throw redirect({ to: '/mypage' })
    }
  },
  component: AdminPage,
})
