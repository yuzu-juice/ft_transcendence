import { queryOptions } from '@tanstack/react-query'
import { type AnalyticsSummaryQuery, analyticsApi } from './api'

const analyticsQueryKeys = {
  all: () => ['analytics'] as const,

  summary: (form: AnalyticsSummaryQuery) => [...analyticsQueryKeys.all(), 'summary', form],
}

export const analyticsQueries = {
  summary: (form: AnalyticsSummaryQuery) =>
    queryOptions({
      queryKey: analyticsQueryKeys.summary(form),
      queryFn: async () => analyticsApi.summary(form),
      refetchInterval: 30 * 1000, // 30sec
      refetchIntervalInBackground: false, // 画面が閲覧されている時のみ更新
      refetchOnWindowFocus: true,
      meta: {
        suppressErrorToast: true,
      },
    }),
}
