import { createFileRoute } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CommonLayout } from '@/components/layout/CommonLayout'
import { useLegalMarkdown } from '../features/legal/useLegalMarkdown'

export const Route = createFileRoute('/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  const content = useLegalMarkdown({ kind: 'terms' })

  return (
    <CommonLayout>
      <article className="mx-auto w-full max-w-4xl text-sm leading-7">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="mb-4 text-2xl font-heading font-bold" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="mb-3 text-xl font-heading font-bold" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-4 mb-2 text-lg font-heading font-bold" {...props} />
            ),
            ul: ({ node, ...props }) => <ul className="list-disc pl-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-4" {...props} />,
            hr: ({ node, ...props }) => <hr className="my-6" {...props} />,
            table: ({ node, ...props }) => (
              <table className="my-2 border border-gray-600" {...props} />
            ),
            th: ({ node, ...props }) => (
              <th className="border border-gray-600 py-0.5 px-3" {...props} />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-gray-600 py-0.5 px-3" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-700 cursor-pointer underline" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </CommonLayout>
  )
}
