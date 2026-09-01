import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonJa from './locales/ja/common.json'
import commonEn from './locales/en/common.json'
import commonZh from './locales/zh/common.json'

const supportedLangs = ['ja', 'en', 'zh'] as const
const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'ja'
const initialLng = supportedLangs.includes(browserLang as (typeof supportedLangs)[number])
  ? browserLang
  : 'ja'

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

export default i18n
