import { Button } from 'otsukimi-ui'

interface PagenationProps {
  current: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagenation = ({ current, totalPages, onPageChange }: PagenationProps) => {
  return (
    <div className="flex flex-row gap-4">
      <Button
        type="button"
        variant="transparent"
        className={`${current === 1 ? '!invisible' : 'display'}`}
        onClick={() => onPageChange(current - 1)}
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
      >
        →
      </Button>
    </div>
  )
}
