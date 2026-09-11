import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { Button, Card } from 'otsukimi-ui'
import { CheckboxField } from '@/components/form/CheckBox'
import { useAppForm } from '@/components/form/form'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import { userSearchQueries } from '../query'
import {
  DEFAULT_TASK_SEARCH_FORM,
  TaskSearchFormSchema,
  toTaskSearchFormValues,
  toTaskSearchParams,
} from '../schema'
import { useTranslation } from 'react-i18next'

const tasksRoute = getRouteApi('/_authenticated/tasks')

export const TaskSearchForm = () => {
  const { t } = useTranslation()
  const search = tasksRoute.useSearch()
  const navigate = tasksRoute.useNavigate()

  const query = useQuery(userSearchQueries.list())

  const form = useAppForm({
    defaultValues: toTaskSearchFormValues(search),
    validators: {
      onChange: TaskSearchFormSchema,
      onSubmit: TaskSearchFormSchema,
    },
    onSubmit: async ({ value }) => {
      navigate({
        search: () => ({
          ...toTaskSearchParams(value),
        }),
      })
    },
  })

  // 戻る/進むなどでURL側の条件が変わった場合にフォームも同期する
  form.reset(toTaskSearchFormValues(search))

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
            {query.isFetching ? t('task.actions.reloading') : t('task.actions.retry')}
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
        <form.AppField name="q">
          {(field) => <field.TextField type="text" label={t('task.form.keyword')} />}
        </form.AppField>

        <div className="flex flex-row flex-wrap gap-y-6 gap-x-12">
          <form.AppField name="status">
            {(field) => {
              return (
                <div className="flex flex-col gap-1.5 text-sm font-bold text-brand-primary">
                  {t('task.form.status')}
                  <div className="flex flex-row flex-wrap gap-5">
                    {(['todo', 'in_progress', 'done'] as const).map((option) => {
                      return (
                        <CheckboxField
                          key={option}
                          label={t(`task.status.${option}`)}
                          checked={field.state.value.includes(option)}
                          onChange={(event) => {
                            field.handleChange(
                              event.target.checked
                                ? [...field.state.value, option]
                                : field.state.value.filter((value) => value !== option),
                            )
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            }}
          </form.AppField>

          <form.AppField name="priority">
            {(field) => {
              return (
                <div className="flex flex-col gap-1.5 text-sm font-bold text-brand-primary">
                  {t('task.form.priority')}
                  <div className="flex flex-row flex-wrap gap-5">
                    {(['low', 'medium', 'high'] as const).map((option) => {
                      return (
                        <CheckboxField
                          key={option}
                          label={t(`task.priority.${option}`)}
                          checked={field.state.value.includes(option)}
                          onChange={(event) => {
                            field.handleChange(
                              event.target.checked
                                ? [...field.state.value, option]
                                : field.state.value.filter((value) => value !== option),
                            )
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            }}
          </form.AppField>
        </div>

        {/* TODO: ユーザの選択をリッチ（ユーザアバタ含めて表示する）にする */}
        <div className="flex flex-row flex-wrap gap-8">
          <form.AppField name="createdBy">
            {(field) => (
              <field.SelectField
                label={t('task.form.createdBy')}
                options={[
                  { label: t('task.form.unspecified'), value: '' },
                  ...query.data.map((user) => {
                    return { label: user.name, value: user.id }
                  }),
                ]}
              />
            )}
          </form.AppField>

          <form.AppField name="assigneeId">
            {(field) => (
              <field.SelectField
                label={t('task.form.assignee')}
                options={[
                  { label: t('task.form.unspecified'), value: '' },
                  ...query.data.map((user) => {
                    return { label: user.name, value: user.id }
                  }),
                ]}
              />
            )}
          </form.AppField>
        </div>

        <div className="min-w-0 max-w-full flex flex-row flex-wrap items-center gap-y-6 gap-x-12">
          <form.AppField name="dueFrom">
            {(field) => <field.TextField type="datetime-local" label={t('task.form.dueFrom')} />}
          </form.AppField>
          <form.AppField name="dueTo">
            {(field) => <field.TextField type="datetime-local" label={t('task.form.dueTo')} />}
          </form.AppField>
        </div>

        <div className="flex flex-row flex-wrap gap-y-6 gap-x-12">
          <form.AppField name="sort">
            {(field) => (
              <field.SelectField
                label={t('task.form.sort')}
                options={[
                  { label: t('task.form.sortOptions.dueAt'), value: 'dueAt' },
                  { label: t('task.form.sortOptions.createdAt'), value: 'createdAt' },
                  { label: t('task.form.sortOptions.updatedAt'), value: 'updatedAt' },
                  { label: t('task.form.sortOptions.status'), value: 'status' },
                  { label: t('task.form.sortOptions.priority'), value: 'priority' },
                ]}
              />
            )}
          </form.AppField>

          <form.AppField name="order">
            {(field) => (
              <field.SelectField
                label={t('task.form.order')}
                options={[
                  { label: t('task.form.orderOptions.asc'), value: 'asc' },
                  { label: t('task.form.orderOptions.desc'), value: 'desc' },
                ]}
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap w-full sm:w-auto gap-4 md:ml-auto mt-auto">
          <Button
            type="button"
            className="w-full sm:w-auto"
            variant="transparent"
            onClick={() => {
              form.reset({
                ...DEFAULT_TASK_SEARCH_FORM,
                status: [...DEFAULT_TASK_SEARCH_FORM.status],
              })
            }}
          >
            {t('task.actions.reset')}
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            {t('task.actions.search')}
          </Button>
        </div>
      </form>
    </Card>
  )
}
