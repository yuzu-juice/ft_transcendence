import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import type { TaskDetail } from '../api'
import { taskMutations } from '../mutation'
import { TaskUpdateFormSchema, type TaskUpdateFormValues, toTaskUpdateRequestBody } from '../schema'
import { toDateTimeLocal } from '../time'
import { useTranslation } from 'react-i18next'

interface TaskEditInfoProps {
  task: TaskDetail
  onBack: () => void
}

export const TaskEditInfo = ({ task, onBack }: TaskEditInfoProps) => {
  const { t } = useTranslation()
  const taskUpdateMutation = useMutation(taskMutations.update())

  const defaultValues: TaskUpdateFormValues = {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority ?? '',
    dueAt: toDateTimeLocal(task.dueAt) ?? '',
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: TaskUpdateFormSchema,
      onSubmit: TaskUpdateFormSchema,
    },
    onSubmit: async ({ value }) => {
      await taskUpdateMutation.mutateAsync({
        taskId: task.id,
        input: toTaskUpdateRequestBody(value),
      })
      toast.success(t('task.updated'))
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
          {(field) => <field.TextField type="text" label={t('task.form.title')} />}
        </form.AppField>

        <form.AppField name="description">
          {(field) => <field.TextAreaField label={t('task.form.description')} />}
        </form.AppField>

        <form.AppField name="status">
          {(field) => (
            <field.SelectField
              label={t('task.form.status')}
              options={[
                { label: t('task.status.todo'), value: 'todo' },
                { label: t('task.status.in_progress'), value: 'in_progress' },
                { label: t('task.status.done'), value: 'done' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="priority">
          {(field) => (
            <field.SelectField
              label={t('task.form.priority')}
              options={[
                { label: t('task.detail.unset'), value: '' },
                { label: t('task.priority.low'), value: 'low' },
                { label: t('task.priority.medium'), value: 'medium' },
                { label: t('task.priority.high'), value: 'high' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField name="dueAt">
          {(field) => <field.TextField type="datetime-local" label={t('task.form.dueAt')} />}
        </form.AppField>

        <div className="flex flex-row gap-4">
          <Button type="button" onClick={() => onBack()} variant="transparent">
            {t('common.cancel')}
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('task.actions.saving') : t('common.save')}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
