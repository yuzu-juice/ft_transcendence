import { getErrorMessage } from '@/lib/api/error'

interface ErrorMessageProps {
  error: unknown
}

// useQueryの返り値であるerrorのみ受け入れる
export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return (
    <div className="w-full flex justify-center py-4">
      <div className="flex flex-col gap-2 text-rose-700">
        <h2 className="font-bold text-2xl">エラー</h2>
        <p>{getErrorMessage(error)}</p>
      </div>
    </div>
  )
}
