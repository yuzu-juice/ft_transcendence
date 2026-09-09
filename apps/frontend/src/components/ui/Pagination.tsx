import { Button } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  current: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ current, totalPages, onPageChange }: PaginationProps) => {
  const { t } = useTranslation()

  if (totalPages === 0) {
    return
  }

  return (
    <div className="flex flex-row gap-6 items-center">
      <Button
        type="button"
        variant="transparent"
        className={`!min-w-0 ${current === 1 ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current - 1)}
        aria-label={t('common.pagination.prev')}
      >
        ←
      </Button>
      <div className="flex flex-row gap-4">
        {t('common.pagination.current', { current, totalPages })}
      </div>
      <Button
        type="button"
        variant="transparent"
        className={`!min-w-0 ${current === totalPages ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current + 1)}
        aria-label={t('common.pagination.next')}
      >
        →
      </Button>
    </div>
  )
}
