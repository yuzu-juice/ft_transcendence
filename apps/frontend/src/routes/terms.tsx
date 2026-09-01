import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
      <article className="text-sm leading-7">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ h1: () => null }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  )
}
