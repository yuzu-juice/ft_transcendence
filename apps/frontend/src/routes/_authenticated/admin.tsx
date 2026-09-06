import { AdminPage } from '@/features/admin/components/AdminPage'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    if (context.user.role !== 'admin') {
      toast.error('このページを表示する権限がありません')
      throw redirect({ to: '/mypage' })
    }
  },
  component: AdminPage,
})
