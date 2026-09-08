import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Button, Card } from 'otsukimi-ui'
import { useRef } from 'react'
import type { CSVLink as CSVLinkType } from 'react-csv'
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import { formatTaskDateTime } from '@/features/task/time'
import { analyticsQueries } from '../query'
import { AnalyticsForm } from './AnalyticsForm'

const analyticsSummaryRoute = getRouteApi('/_authenticated/analytics')

type SummaryItemProps = {
  label: string
  value: string
}

const SummaryItem = ({ label, value }: SummaryItemProps) => {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  )
}

type BreakdownItemProps = {
  label: string
  count: number
  total: number
  countLabel: string
}

const BreakdownItem = ({ label, count, total, countLabel }: BreakdownItemProps) => {
  const ratio = total === 0 ? 0 : (count / total) * 100
  const clampedRatio = Math.min(Math.max(ratio, 0), 100)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">{label}</span>
        <span className="text-gray-600">{countLabel}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-brand-primary-soft" style={{ width: `${clampedRatio}%` }} />
      </div>
    </div>
  )
}

export const AnalyticsPage = () => {
  const { t } = useTranslation()
  const search = analyticsSummaryRoute.useSearch()

  const query = useQuery(analyticsQueries.summary(search))

  const csvLinkRef = useRef<CSVLinkType | null>(null)

  if (query.isPending) {
    return <Loading />
  }

  if (!query.isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <ErrorMessage error={query.error} />
        <div className="flex justify-center">
          <Button
            type="button"
            disabled={query.isFetching}
            onClick={() => {
              query.refetch()
            }}
          >
            {query.isFetching ? t('analytics.reload') : t('analytics.retry')}
          </Button>
        </div>
      </div>
    )
  }

  const { totalTasksCount, byStatus, byPriority, overdueCount, completionRate } = query.data
  const completionRateText = `${Math.round(completionRate * 100)}%`

  const csvData = [
    {
      category: 'Summary',
      metric: 'Total Tasks',
      value: totalTasksCount,
    },
    {
      category: 'Summary',
      metric: 'Completion Rate',
      value: completionRateText,
    },
    {
      category: 'Summary',
      metric: 'Overdue Tasks',
      value: overdueCount,
    },

    {
      category: 'Status',
      metric: 'Todo',
      value: byStatus.todo,
    },
    {
      category: 'Status',
      metric: 'In Progress',
      value: byStatus.in_progress,
    },
    {
      category: 'Status',
      metric: 'Done',
      value: byStatus.done,
    },

    {
      category: 'Priority',
      metric: 'High',
      value: byPriority.high,
    },
    {
      category: 'Priority',
      metric: 'Medium',
      value: byPriority.medium,
    },
    {
      category: 'Priority',
      metric: 'Low',
      value: byPriority.low,
    },
    {
      category: 'Priority',
      metric: 'Unset',
      value: byPriority.unset,
    },
  ]

  const csvHeaders = [
    { label: 'Category', key: 'category' },
    { label: 'Metric', key: 'metric' },
    { label: 'Value', key: 'value' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row flex-wrap items-center">
        <h2 className="text-2xl font-heading font-bold">{t('analytics.title')}</h2>
        <Button
          className="ml-auto"
          onClick={() => {
            csvLinkRef.current?.link.click()
          }}
        >
          Export CSV
        </Button>
        <CSVLink
          ref={csvLinkRef}
          data={csvData}
          headers={csvHeaders}
          filename="analytics.csv"
          hidden
        />
      </div>

      <AnalyticsForm />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SummaryItem
          label={t('analytics.totalTasks')}
          value={t('analytics.taskCount', { count: totalTasksCount })}
        />
        <SummaryItem label={t('analytics.completionRate')} value={completionRateText} />
        <SummaryItem
          label={t('analytics.overdue')}
          value={t('analytics.taskCount', { count: overdueCount })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-heading font-bold">{t('analytics.statusBreakdown')}</h3>
            <BreakdownItem
              label={t('analytics.status.todo')}
              count={byStatus.todo}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byStatus.todo })}
            />
            <BreakdownItem
              label={t('analytics.status.inProgress')}
              count={byStatus.in_progress}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byStatus.in_progress })}
            />
            <BreakdownItem
              label={t('analytics.status.done')}
              count={byStatus.done}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byStatus.done })}
            />
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-heading font-bold">{t('analytics.priorityBreakdown')}</h3>
            <BreakdownItem
              label={t('analytics.priority.high')}
              count={byPriority.high}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byPriority.high })}
            />
            <BreakdownItem
              label={t('analytics.priority.medium')}
              count={byPriority.medium}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byPriority.medium })}
            />
            <BreakdownItem
              label={t('analytics.priority.low')}
              count={byPriority.low}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byPriority.low })}
            />
            <BreakdownItem
              label={t('analytics.priority.unset')}
              count={byPriority.unset}
              total={totalTasksCount}
              countLabel={t('analytics.taskCount', { count: byPriority.unset })}
            />
          </div>
        </Card>
      </div>
      <span className="text-sm ml-auto mr-6">
        {t('analytics.lastUpdated')}:{' '}
        {formatTaskDateTime(new Date(query.dataUpdatedAt).toISOString())}
      </span>
    </div>
  )
}
