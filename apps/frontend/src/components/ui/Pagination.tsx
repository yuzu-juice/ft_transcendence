import { Button } from 'otsukimi-ui'

interface PaginationProps {
  current: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ current, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages === 0) {
    return
  }

  return (
    <div className="flex flex-row gap-4">
      <Button
        type="button"
        variant="transparent"
        className={`${current === 1 ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current - 1)}
        aria-label="前のページ"
      >
        ←
      </Button>
      <div className="flex flex-row gap-4">
        {current} / {totalPages}
      </div>
      <Button
        type="button"
        variant="transparent"
        className={`${current === totalPages ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current + 1)}
        aria-label="次のページ"
      >
        →
      </Button>
    </div>
  )
}
