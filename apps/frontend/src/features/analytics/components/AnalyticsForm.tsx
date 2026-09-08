import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Button, Card } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'
import { useAppForm } from '@/components/form/form'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import {
  AnalyticsSummaryFormSchema,
  DEFAULT_ANALYTICS_SUMMARY_FORM_VALUE,
  toAnalyticsSummaryFormValues,
  toAnalyticsSummaryParams,
} from '@/features/analytics/schema'
import { userSearchQueries } from '@/features/task/query'

const analyticsSummaryRoute = getRouteApi('/_authenticated/analytics')

export const AnalyticsForm = () => {
  const { t } = useTranslation()

  const search = analyticsSummaryRoute.useSearch()
  const navigate = analyticsSummaryRoute.useNavigate()

  const query = useQuery(userSearchQueries.list())

  const form = useAppForm({
    defaultValues: toAnalyticsSummaryFormValues(search),
    validators: {
      onChange: AnalyticsSummaryFormSchema,
      onSubmit: AnalyticsSummaryFormSchema,
    },
    onSubmit: async ({ value }) => {
      navigate({
        search: () => ({
          ...toAnalyticsSummaryParams(value),
        }),
      })
    },
  })

  // 戻る/進むなどでURL側の条件が変わった場合にフォームも同期する
  form.reset(toAnalyticsSummaryFormValues(search))

  if (query.isLoading) {
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

  return (
    <Card>
      <form
        noValidate
        className="flex flex-row flex-wrap gap-y-6 gap-x-12"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="assigneeId">
          {(field) => (
            <field.SelectField
              label={t('analytics.assignee')}
              options={[
                { label: t('analytics.notSpecified'), value: '' },
                ...query.data.map((user) => {
                  return { label: user.name, value: user.id }
                }),
              ]}
            />
          )}
        </form.AppField>

        <div className="flex flex-row flex-wrap items-center gap-y-6 gap-x-12">
          <form.AppField name="dueFrom">
            {(field) => (
              <field.TextField type="datetime-local" label={t('analytics.dueDatetimeFrom')} />
            )}
          </form.AppField>
          <form.AppField name="dueTo">
            {(field) => (
              <field.TextField type="datetime-local" label={t('analytics.dueDatetimeTo')} />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-row gap-4 ml-auto mt-auto">
          <Button
            type="button"
            className="w-full"
            variant="transparent"
            onClick={() => {
              form.reset({
                ...DEFAULT_ANALYTICS_SUMMARY_FORM_VALUE,
              })
            }}
          >
            {t('common.reset')}
          </Button>
          <Button type="submit" className="w-full">
            {t('common.search')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
