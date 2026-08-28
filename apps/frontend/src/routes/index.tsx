import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <section className="flex flex-col gap-2.5 text-center">
        <h1 className="text-6xl font-bold bg-[linear-gradient(90deg,#ff6262_0%,#ff9e84_28%,#ffe47a_52%,#bada55_72%,#16c7c8_100%)] bg-clip-text text-transparent">
          LunaPhase
        </h1>
        <p className="text-xl">ちょー簡単に操作できるプロジェクト管理アプリ</p>
      </section>
    </main>
  )
}
