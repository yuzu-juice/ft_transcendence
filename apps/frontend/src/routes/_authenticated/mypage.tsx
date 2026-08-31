import { createFileRoute } from '@tanstack/react-router'

import { SignOutButton } from '@/features/user/components/SignOutButton'
import { PageList } from '@/features/user/components/PageList'
import { UserProfile } from '@/features/user/components/UserProfile'

export const Route = createFileRoute('/_authenticated/mypage')({
  component: MyPage,
})

function MyPage() {
  return (
    <div className="flex flex-col gap-8">
      <UserProfile />
      <PageList />
      <SignOutButton />
    </div>
  )
}
