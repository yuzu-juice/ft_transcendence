export const formatTaskDateTime = (date: string) => {
  // TODO(i18n): 使用言語に合わせてlocalesを変更
  return new Date(date).toLocaleString('ja-JP')
}

export const formatTaskDate = (date: string) => {
  // TODO(i18n): 使用言語に合わせてlocalesを変更
  return new Date(date).toLocaleDateString('ja-JP')
}

export const getRelativeDueTime = (date: string) => {
  const d = new Date(date)
  const offsetDay = Math.trunc((d.getTime() - Date.now()) / 1000 / 60 / 60 / 24)

  // TODO(i18n): 使用言語に合わせてlocalesを変更
  return new Intl.RelativeTimeFormat('ja-JP', { style: 'short' }).format(offsetDay, 'day')
}

export const isOverDue = (date: string) => {
  return new Date() > new Date(date)
}
