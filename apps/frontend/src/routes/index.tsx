import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <main className="p-8">
      <h1 className="text-2xl text-cyan-800 font-bold">ft_transcendence</h1>
    </main>
  )
}
