import { AnalyticsPage } from '@/features/analytics/components/AnalyticsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/analytics')({
  component: AnalyticsPage,
})
