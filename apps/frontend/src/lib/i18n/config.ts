import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonJa from './locales/ja/common.json'
import commonEn from './locales/en/common.json'
import commonZh from './locales/zh/common.json'

const supportedLangs = ['ja', 'en', 'zh'] as const
const LANGUAGE_STORAGE_KEY = 'ft.language'

const isSupportedLanguage = (value: string): value is (typeof supportedLangs)[number] => {
  return supportedLangs.some((lang) => lang === value)
}

const normalizeLanguage = (value: string | null | undefined): (typeof supportedLangs)[number] => {
  const lang = value?.split('-')[0] ?? ''
  return isSupportedLanguage(lang) ? lang : 'ja'
}

const storedLang =
  typeof window !== 'undefined' ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null
const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'ja'
const initialLng = normalizeLanguage(storedLang ?? browserLang)

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
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language))
})

export default i18n
