import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
] as const

export const Footer = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).split('-')[0]

  return (
    <footer className="w-full flex flex-col gap-2 border-t-2 border-brand-primary-soft px-6 py-3 justify-center items-center">
      <div className="flex flex-row gap-2.5 text-sm">
        <Link to="/terms" className="underline">
          {t('legal.terms.title')}
        </Link>
        <Link to="/privacy" className="underline">
          {t('legal.privacy.title')}
        </Link>
      </div>
      <div className="flex rounded-sm border border-border text-xs overflow-hidden">
        {languages.map((language) => {
          const isCurrentLanguage = currentLanguage === language.code

          return (
            <button
              key={language.code}
              type="button"
              aria-pressed={isCurrentLanguage}
              className={`cursor-pointer px-2 py-1 transition duration-300 ${
                isCurrentLanguage
                  ? 'bg-brand-primary text-white'
                  : 'bg-bg-surface text-text-primary hover:bg-brand-primary-soft'
              }`}
              onClick={() => void i18n.changeLanguage(language.code)}
            >
              {language.label}
            </button>
          )
        })}
      </div>
      <small>&copy; 2026 Team Still Alive</small>
    </footer>
  )
}
