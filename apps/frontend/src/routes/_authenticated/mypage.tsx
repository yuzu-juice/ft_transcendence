import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/mypage')({
  component: MyPage,
})

function MyPage() {
  return <div className="p-2">Hello from MyPage!</div>
}
