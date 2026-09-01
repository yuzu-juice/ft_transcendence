import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useLegalMarkdown } from '../features/legal/useLegalMarkdown'

export const Route = createFileRoute('/privacy')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const content = useLegalMarkdown({ kind: 'privacy' })

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-heading font-bold">{t('legal.privacy.title')}</h1>
      <article className="text-sm leading-7">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </main>
  )
}
