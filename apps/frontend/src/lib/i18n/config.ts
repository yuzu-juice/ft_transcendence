import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from './locales/en/common.json'
import commonJa from './locales/ja/common.json'
import commonZh from './locales/zh/common.json'

const supportedLangs = ['ja', 'en', 'zh'] as const
const LANGUAGE_STORAGE_KEY = 'ft.language'
const descriptionByLanguage = {
  ja: commonJa.home.tagline,
  en: commonEn.home.tagline,
  zh: commonZh.home.tagline,
} as const

const isSupportedLanguage = (value: string): value is (typeof supportedLangs)[number] => {
  return supportedLangs.some((lang) => lang === value)
}

const normalizeLanguage = (value: string | null | undefined): (typeof supportedLangs)[number] => {
  const lang = value?.split('-')[0] ?? ''
  return isSupportedLanguage(lang) ? lang : 'ja'
}

const applyDocumentLanguage = (language: string) => {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.lang = normalizeLanguage(language)
}

const applyDocumentDescription = (language: string) => {
  if (typeof document === 'undefined') {
    return
  }

  const lang = normalizeLanguage(language)
  const content = descriptionByLanguage[lang]
  const descriptionMeta = document.querySelector('meta[name="description"]')

  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', content)
  }
}

let storedLang: string | null = null
if (typeof window !== 'undefined') {
  try {
    storedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  } catch {}
}
const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'ja'
const initialLng = normalizeLanguage(storedLang ?? browserLang)

applyDocumentLanguage(initialLng)
applyDocumentDescription(initialLng)

void i18n.use(initReactI18next).init({
  lng: initialLng,
  supportedLngs: [...supportedLangs],
  nonExplicitSupportedLngs: true,
  fallbackLng: 'ja',
  defaultNS: 'common',
  ns: ['common'],
  resources: {
    ja: { common: commonJa },
    en: { common: commonEn },
    zh: { common: commonZh },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // 翻訳リソースはローカルにあるため、suspenseは不要
  },
})

i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language)
  applyDocumentDescription(language)

  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language))
  } catch {}
})

export default i18n
