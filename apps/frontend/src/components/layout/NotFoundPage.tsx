import { useTranslation } from 'react-i18next'
import { CustomLink } from '@/components/ui/CustomLink'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'

export const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-dvh w-full flex flex-col gap-8">
      <Header />
      <main className="flex-1 flex flex-col items-center gap-3">
        <h2 className="text-5xl font-bold">404 Not Found</h2>
        <CustomLink to="/" className="text-lg">
          {t('notFound.goToHome')}
        </CustomLink>
      </main>
      <Footer />
    </div>
  )
}
