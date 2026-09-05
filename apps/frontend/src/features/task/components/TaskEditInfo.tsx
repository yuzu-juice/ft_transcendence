import { Button } from 'otsukimi-ui'
import type { Task } from '../api'
import { useAppForm } from '@/components/form/form'
import { type TaskUpdateFormInput, TaskUpdateFormSchema } from '../schema'
import { toDateTimeLocal } from '../time'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { taskMutations } from '../mutation'

interface TaskEditInfoProps {
  task: Task
  onBack: () => void
}

export const TaskEditInfo = ({ task, onBack }: TaskEditInfoProps) => {
  const taskUpdateMutation = useMutation(taskMutations.update())

  const defaultValues: TaskUpdateFormInput = {
    title: task.title,
    description: task.description ?? '',
    status: task.status as TaskUpdateFormInput['status'],
    priority: task.priority ? (task.priority as TaskUpdateFormInput['priority']) : '',
    dueAt: toDateTimeLocal(task.dueAt) ?? '',
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: TaskUpdateFormSchema,
      onSubmit: TaskUpdateFormSchema,
    },
    onSubmit: async ({ value }) => {
      // 入力された値が空の場合、undefinedに変換しAPI送信用のフォーマットに合わせる
      await taskUpdateMutation.mutateAsync({
        taskId: task.id,
        input: {
          title: value.title,
          description: value.description === '' ? undefined : value.description,
          status: value.status,
          priority: value.priority === '' ? undefined : value.priority,
          dueAt: value.dueAt ? new Date(value.dueAt).toISOString() : undefined,
        },
      })
      toast.success('タスク情報を更新しました')
      onBack()
    },
  })

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
        <form.AppField name="title">
          {(field) => <field.TextField type="text" label="タイトル" />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => <field.TextAreaField label="説明" />}
        </form.AppField>

        <form.AppField name="status">
          {(field) => (
            <field.SelectField
              label="ステータス"
              options={[
                { label: 'todo', value: 'todo' },
                { label: 'in_progress', value: 'in_progress' },
                { label: 'done', value: 'done' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="priority">
          {(field) => (
            <field.SelectField
              label="優先度"
              options={[
                { label: '未設定', value: '' },
                { label: 'low', value: 'low' },
                { label: 'medium', value: 'medium' },
                { label: 'high', value: 'high' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="dueAt">
          {(field) => <field.TextField type="datetime-local" label="締切" />}
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
