import { colorLegend, defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { Chart } from '@tanstack/charts/react/tooltip'
import { scaleOrdinal } from '@tanstack/charts/scales/ordinal'
import { tooltip } from '@tanstack/charts/tooltip'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Button, Card } from 'otsukimi-ui'
import { useMemo } from 'react'
import { CSVLink } from 'react-csv'
import { useTranslation } from 'react-i18next'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import { formatTaskDateTime } from '@/lib/utils/time'
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

const STATUS_COLORS = [
  '#F7A8C4', // todo: pink
  '#F6D95B', // in_progress: yellow
  '#A8E66B', // done: yellow-green
]

export const PRIORITY_COLORS = [
  '#8EC5F4', // low: blue
  '#F7B55A', // medium: orange
  '#F47F7F', // high: red
  '#C9CDD3', // unset: gray
]

type PieChartProps = {
  data: Record<string, number>
  colors: string[]
  ariaLabel: string
}

const PieChartCard = ({ data, colors, ariaLabel }: PieChartProps) => {
  const definition = useMemo(() => {
    const rows = Object.entries(data).map(([name, value]) => ({ name, value }))
    const slices = pie(rows, {
      value: 'value',
    })

    return defineChart(
      {
        marks: [
          polar({
            inset: 0,
            radiusRatio: 0.8,
            scales: {
              angle: null,
              radius: null,
            },
            marks: [
              radialArc(slices, {
                id: 'status-slices',
                key: 'name',
                color: 'name',
              }),
            ],
          }),
        ],
        scales: {
          x: null,
          y: null,
        },
        color: {
          scale: scaleOrdinal(
            rows.map((row) => row.name),
            colors,
          ),
          legend: colorLegend({
            placement: 'bottom',
          }),
        },
        margin: { top: 10, right: 10, left: 10, bottom: 40 },
      },
      {
        keyboard: true,
        tooltip: {
          use: tooltip,
          ...{
            format: ({ datum }) => `${datum.name} · ${datum.value}`,
          },
        },
      },
    )
  }, [data, colors])

  return (
    <Card>
      <h3 className="text-lg font-heading font-bold">{ariaLabel}</h3>
      <Chart ariaLabel={ariaLabel} definition={definition} height={300} />
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
      <div className="flex flex-row flex-wrap items-center gap-4">
        <h2 className="text-2xl font-heading font-bold">{t('analytics.title')}</h2>
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename="analytics.csv"
          className="ml-auto text-brand-primary-deep cursor-pointer"
        >
          Export CSV
        </CSVLink>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PieChartCard
          data={byStatus}
          colors={STATUS_COLORS}
          ariaLabel={t('analytics.statusBreakdown')}
        />
        <PieChartCard
          data={byPriority}
          colors={PRIORITY_COLORS}
          ariaLabel={t('analytics.priorityBreakdown')}
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
