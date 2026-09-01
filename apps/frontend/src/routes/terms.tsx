import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLegalMarkdown } from '../features/legal/useLegalMarkdown'

export const Route = createFileRoute('/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const content = useLegalMarkdown({ kind: 'terms' })

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-heading font-bold">{t('legal.terms.title')}</h1>
      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7">{content}</pre>
    </main>
  )
}
