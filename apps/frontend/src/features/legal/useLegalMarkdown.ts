import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const legalMarkdownFiles = {
  terms: 'terms-of-service.md',
  privacy: 'privacy-policy.md',
} as const

type LegalMarkdownKind = keyof typeof legalMarkdownFiles

type UseLegalMarkdownOptions = {
  kind: LegalMarkdownKind
}

export function useLegalMarkdown({ kind }: UseLegalMarkdownOptions) {
  const { i18n } = useTranslation()
  const [content, setContent] = useState('')
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
      const fileName = legalMarkdownFiles[kind]
      const paths = Array.from(
        new Set([
          `/legal/${langCode}/${fileName}`,
          `/legal/ja/${fileName}`,
          `/legal/en/${fileName}`,
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
          throw new Error(`Failed to load ${kind} document`)
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
  }, [i18n.language, i18n.resolvedLanguage, kind])

  return { content, isLoading, isError }
}
