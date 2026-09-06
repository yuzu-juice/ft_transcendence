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
    <div className="flex flex-row gap-6 items-center">
      <Button
        type="button"
        variant="transparent"
        className={`!min-w-0 ${current === 1 ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current - 1)}
        aria-label="前のページ"
      >
        ←
      </Button>
      <div className="flex flex-row gap-4">
        Page {current} / {totalPages}
      </div>
      <Button
        type="button"
        variant="transparent"
        className={`!min-w-0 ${current === totalPages ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current + 1)}
        aria-label="次のページ"
      >
        →
      </Button>
    </div>
  )
}
