import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t, i18n } = useTranslation()
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      setIsError(false)
      setContent('')

      const language = i18n.resolvedLanguage ?? i18n.language
      const langCode = language.split('-')[0]
      const paths = Array.from(
        new Set([
          `/legal/${langCode}/terms-of-service.md`,
          '/legal/ja/terms-of-service.md',
          '/legal/en/terms-of-service.md',
        ]),
      )

      try {
        let loadedText: string | null = null

        for (const path of paths) {
          const response = await fetch(path)
          if (response.ok) {
            const text = await response.text()
            const contentType = response.headers.get('content-type') ?? ''
            const isHtmlFallback =
              contentType.includes('text/html') ||
              text.trimStart().toLowerCase().startsWith('<!doctype html')

            if (!isHtmlFallback) {
              loadedText = text
              break
            }
          }
        }

        if (!loadedText) {
          throw new Error('Failed to load terms of service')
        }

        if (isMounted) {
          setContent(loadedText)
          setIsError(false)
        }
      } catch {
        if (isMounted) {
          setIsError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [i18n.language, i18n.resolvedLanguage])

  if (isLoading) {
    return <div className="mx-auto w-full max-w-4xl p-6">{t('legal.terms.loading')}</div>
  }

  if (isError) {
    return <div className="mx-auto w-full max-w-4xl p-6">{t('legal.terms.error')}</div>
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-heading font-bold">{t('legal.terms.title')}</h1>
      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7">{content}</pre>
    </main>
  )
}
