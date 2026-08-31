import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getErrorMessage } from '@/lib/api/error'

// Tanstack Queryのクライアントを生成
export const queryClient = new QueryClient({
  // useQuery使用時の共通の振る舞いを実装する
  queryCache: new QueryCache({
    // useQuery時にエラーが発生した場合の振る舞い
    // 共通してtoastにエラーメッセージを表示する
    onError: async (error, query) => {
      if (query.meta?.suppressErrorToast) {
        return
      }

      toast.error(await getErrorMessage(error))
    },
  }),

  // useMutation使用時の共通の振る舞いを実装する
  mutationCache: new MutationCache({
    onError: async (error, _variables, _result, mutation) => {
      if (mutation.meta?.suppressErrorToast) {
        return
      }

      toast.error(await getErrorMessage(error))
    },
  }),

  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000, // 取得済みデータを新鮮であるとみなす期間
    },
  },
})
