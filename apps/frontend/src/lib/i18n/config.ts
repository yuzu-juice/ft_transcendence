import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonJa from './locales/ja/common.json'
import commonEn from './locales/en/common.json'

void i18n.use(initReactI18next).init({
  lng: 'ja',
  fallbackLng: 'ja',
  defaultNS: 'common',
  ns: ['common'],
  resources: {
    ja: { common: commonJa },
    en: { common: commonEn },
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
