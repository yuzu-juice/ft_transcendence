import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsPage } from '@/features/analytics/components/AnalyticsPage'
import { AnalyticsSummaryParamsSchema } from '@/features/analytics/schema'

export const Route = createFileRoute('/_authenticated/analytics')({
  validateSearch: AnalyticsSummaryParamsSchema,
  component: AnalyticsPage,
})
