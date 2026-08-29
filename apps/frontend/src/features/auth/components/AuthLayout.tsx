import { Card } from 'otsukimi-ui'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const AuthLayout = ({ children }: Props) => {
  return (
    <main className="min-h-dvh w-full flex items-center justify-center px-4 py-8">
      <Card className="bg-white w-full max-w-md px-4 py-6 rounded-sm border-2 border-border shadow-md flex flex-col gap-6 items-center">
        <h2 className="text-brand-primary text-2xl font-bold">LunaPhase</h2>
        {children}
      </Card>
    </main>
  )
}
