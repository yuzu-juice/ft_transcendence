import { createFileRoute } from '@tanstack/react-router'
import { CommonLayout } from '@/components/layout/CommonLayout'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <CommonLayout>
      <div className="flex items-center justify-center">
        <section className="flex flex-col gap-2.5 justify-center text-center">
          <h1 className="text-6xl font-bold text-brand-primary">LunaPhase</h1>
          <p className="text-xl">ちょー簡単に操作できるプロジェクト管理アプリ</p>
        </section>
      </div>
    </CommonLayout>
  )
}
