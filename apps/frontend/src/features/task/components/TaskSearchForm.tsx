import { useAppForm } from '@/components/form/form'
import { getRouteApi } from '@tanstack/react-router'
import {
  DEFAULT_TASK_SEARCH_FORM,
  TaskSearchFormSchema,
  type TaskSearchFormInput,
  type TaskSearchParamsInput,
} from '../schema'
import { Button, Card } from 'otsukimi-ui'
import { CheckboxField } from '@/components/form/CheckBox'
import { toDateTimeLocal } from '../time'
import { Loading } from '@/components/ui/Loading'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useQuery } from '@tanstack/react-query'
import { userSearchQueries } from '../query'

const tasksRoute = getRouteApi('/_authenticated/tasks')

// 入力された値が空の場合、undefinedに変換しAPI送信用のフォーマットに合わせる
const toTaskSearchInput = (form: TaskSearchFormInput, page = 1): TaskSearchParamsInput => ({
  q: form.q || undefined,
  status: form.status.length > 0 ? form.status : undefined,
  priority: form.priority.length > 0 ? form.priority : undefined,
  dueFrom: form.dueFrom ? new Date(form.dueFrom).toISOString() : undefined,
  dueTo: form.dueTo ? new Date(form.dueTo).toISOString() : undefined,
  createdBy: form.createdBy || undefined,
  assigneeId: form.assigneeId || undefined,
  sort: form.sort,
  order: form.order,
  page,
})

export const TaskSearchForm = () => {
  const search = tasksRoute.useSearch()
  const navigate = tasksRoute.useNavigate()

  const query = useQuery(userSearchQueries.list())

  const form = useAppForm({
    defaultValues: {
      q: search.q || '',
      status: search.status ? search.status : [],
      priority: search.priority ? search.priority : [],
      dueFrom: toDateTimeLocal(search?.dueFrom) || '',
      dueTo: toDateTimeLocal(search?.dueTo) || '',
      createdBy: search.createdBy ? search.createdBy : '',
      assigneeId: search.assigneeId ? search.assigneeId : '',
      sort: search.sort,
      order: search.order,
    },
    validators: {
      onChange: TaskSearchFormSchema,
      onSubmit: TaskSearchFormSchema,
    },
    onSubmit: async ({ value }) => {
      navigate({
        search: () => ({
          ...toTaskSearchInput(value),
        }),
      })
    },
  })

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
            {query.isFetching ? '再読み込み中...' : '再試行'}
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
          {(field) => <field.TextField type="text" label="キーワード" />}
        </form.AppField>

        <div className="flex flex-row flex-wrap gap-y-6 gap-x-12">
          <form.AppField name="status">
            {(field) => {
              return (
                <div className="flex flex-col gap-1.5 text-sm font-bold text-brand-primary">
                  ステータス
                  <div className="flex flex-row flex-wrap gap-5">
                    {(['todo', 'in_progress', 'done'] as const).map((option) => {
                      return (
                        <CheckboxField
                          key={option}
                          label={option}
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
                  優先度
                  <div className="flex flex-row flex-wrap gap-5">
                    {(['low', 'medium', 'high'] as const).map((option) => {
                      return (
                        <CheckboxField
                          key={option}
                          label={option}
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
                label="作成者"
                options={[
                  { label: '未指定', value: '' },
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
                label="担当者"
                options={[
                  { label: '未指定', value: '' },
                  ...query.data.map((user) => {
                    return { label: user.name, value: user.id }
                  }),
                ]}
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-y-6 gap-x-12">
          <form.AppField name="dueFrom">
            {(field) => <field.TextField type="datetime-local" label="締切開始" />}
          </form.AppField>
          <form.AppField name="dueTo">
            {(field) => <field.TextField type="datetime-local" label="締切終了" />}
          </form.AppField>
        </div>

        <div className="flex flex-row flex-wrap gap-y-6 gap-x-12">
          <form.AppField name="sort">
            {(field) => (
              <field.SelectField
                label="並べ替え基準"
                options={[
                  { label: '締切日時', value: 'dueAt' },
                  { label: '作成日時', value: 'createdAt' },
                  { label: '更新日時', value: 'updatedAt' },
                  { label: 'ステータス', value: 'status' },
                  { label: '優先度', value: 'priority' },
                ]}
              />
            )}
          </form.AppField>

          <form.AppField name="order">
            {(field) => (
              <field.SelectField
                label="並び順"
                options={[
                  { label: '昇順', value: 'asc' },
                  { label: '降順', value: 'desc' },
                ]}
              />
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
                ...DEFAULT_TASK_SEARCH_FORM,
                status: [...DEFAULT_TASK_SEARCH_FORM.status],
              })
            }}
          >
            リセット
          </Button>
          <Button type="submit" className="w-full">
            検索
          </Button>
        </div>
      </form>
    </Card>
  )
}
