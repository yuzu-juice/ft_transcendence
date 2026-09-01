import { useTranslation } from 'react-i18next'

import enPrivacyPolicy from '../../content/legal/en/privacy-policy.md?raw'
import enTermsOfService from '../../content/legal/en/terms-of-service.md?raw'
import jaPrivacyPolicy from '../../content/legal/ja/privacy-policy.md?raw'
import jaTermsOfService from '../../content/legal/ja/terms-of-service.md?raw'

const legalMarkdown = {
  terms: {
    en: enTermsOfService,
    ja: jaTermsOfService,
  },
  privacy: {
    en: enPrivacyPolicy,
    ja: jaPrivacyPolicy,
  },
} as const

type LegalMarkdownKind = keyof typeof legalMarkdown
type LegalMarkdownLanguage = keyof (typeof legalMarkdown)[LegalMarkdownKind]

type UseLegalMarkdownOptions = {
  kind: LegalMarkdownKind
}

export function useLegalMarkdown({ kind }: UseLegalMarkdownOptions) {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? i18n.language
  const langCode = language.split('-')[0] as LegalMarkdownLanguage
  const content = legalMarkdown[kind][langCode] ?? legalMarkdown[kind].ja

  return { content, isLoading: false, isError: false }
}
