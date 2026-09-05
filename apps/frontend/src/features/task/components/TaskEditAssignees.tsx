import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import { UserAvatar } from '@/components/ui/UserAvatar'
import type { TaskDetail } from '../api'
import { taskMutations } from '../mutation'
import { userSearchQueries } from '../query'
import { TaskAssigneesFormSchema, toTaskAssigneesUpdateRequestBody } from '../schema'

interface TaskEditAssigneesProps {
  task: TaskDetail
  onBack: () => void
}

export const TaskEditAssignees = ({ task, onBack }: TaskEditAssigneesProps) => {
  const query = useQuery(userSearchQueries.list())
  const taskAssigneesUpdateMutation = useMutation(taskMutations.updateAssignees())

  const form = useAppForm({
    defaultValues: {
      assigneeIds: task.assignees.map((assignee) => assignee.id) as string[],
    },
    validators: {
      onChange: TaskAssigneesFormSchema,
      onSubmit: TaskAssigneesFormSchema,
    },
    onSubmit: async ({ value }) => {
      await taskAssigneesUpdateMutation.mutateAsync({
        taskId: task.id,
        input: toTaskAssigneesUpdateRequestBody(value),
      })
      toast.success('タスク担当者情報を更新しました')
      onBack()
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
    <div className="flex flex-col gap-6">
      <form
        noValidate
        className="flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.AppField name="assigneeIds">
          {(field) => {
            const toggleUser = (userId: string, checked: boolean) => {
              field.handleChange((current) =>
                checked ? [...current, userId] : current.filter((id) => id !== userId),
              )
            }
            return (
              <div className="max-h-80 overflow-y-auto flex flex-col border border-border rounded-md">
                {query.data.map((user) => {
                  return (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 px-6 py-2.5 border-b border-border cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={field.state.value.includes(user.id)}
                        onChange={(e) => toggleUser(user.id, e.target.checked)}
                        className="h-5 w-5 border-2 border-border rounded-md bg-bg-surface transition duration-150 accent-brand-primary-deep focus:bg-brand-primary-deep"
                      />
                      <UserAvatar
                        userId={user.id}
                        avatarUrl={user.image}
                        alt={`${user.name}のアバター`}
                        className="size-8 shrink-0 rounded-xs"
                      />
                      <span>{user.name}</span>
                    </label>
                  )
                })}
              </div>
            )
          }}
        </form.AppField>

        <div className="flex flex-row gap-4">
          <Button type="button" onClick={() => onBack()} variant="transparent">
            キャンセル
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '保存しています...' : '保存'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
