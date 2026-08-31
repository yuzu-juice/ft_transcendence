import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { CustomLink } from '@/components/ui/CustomLink'

export const NotFoundPage = () => {
  return (
    <div className="min-h-dvh w-full flex flex-col gap-8">
      <Header />
      <main className="flex-1 flex flex-col items-center gap-3">
        <h2 className="text-5xl font-bold">404 Not Found</h2>
        <CustomLink to="/" className="text-lg">
          トップページへ
        </CustomLink>
      </main>
      <Footer />
    </div>
  )
}
