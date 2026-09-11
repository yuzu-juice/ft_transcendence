import i18n from '../i18n/config'

export const formatTaskDateTime = (date: string) => {
  const currentLanguage = i18n.language

  return new Date(date).toLocaleString(currentLanguage)
}

export const formatTaskDate = (date: string) => {
  const currentLanguage = i18n.language

  return new Date(date).toLocaleDateString(currentLanguage)
}

export const getRelativeDueTime = (date: string) => {
  const d = new Date(date)
  const offsetDay = Math.trunc((d.getTime() - Date.now()) / 1000 / 60 / 60 / 24)
  const currentLanguage = i18n.language

  return new Intl.RelativeTimeFormat(currentLanguage, { style: 'short' }).format(offsetDay, 'day')
}

export const isOverDue = (date: string) => {
  return new Date() > new Date(date)
}

export const toDateTimeLocal = (value: string | null | undefined) => {
  if (!value) return null

  const date = new Date(value)

  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}
