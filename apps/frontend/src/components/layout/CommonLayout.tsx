import type { ReactNode } from 'react'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

interface CommonLayoutProps {
  children: ReactNode
}

export const CommonLayout = ({ children }: CommonLayoutProps) => {
  return (
    <div className="min-h-dvh w-full flex flex-col gap-8">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
