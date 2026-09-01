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
          components={{
            h2: ({ node, ...props }) => (
              <h2 className="mt-8 mb-3 text-xl font-heading font-bold" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-6 mb-2 text-lg font-heading font-bold" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  )
}
