import type { ReactNode } from 'react'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'

interface CommonLayoutProps {
  children: ReactNode
}

export const CommonLayout = ({ children }: CommonLayoutProps) => {
  return (
    <div className="min-h-dvh w-full flex flex-col gap-8">
      <Header />
      <main className="flex-1 px-6">{children}</main>
      <Footer />
    </div>
  )
}
