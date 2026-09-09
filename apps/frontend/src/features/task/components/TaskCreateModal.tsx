import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { Modal } from '@/components/ui/Modal'
import { taskMutations } from '../mutation'
import { TaskCreateFormSchema, type TaskCreateFormValues, toTaskCreateRequestBody } from '../schema'
import { useTranslation } from 'react-i18next'

interface TaskCreateModalProps {
  open: boolean
  handleOpenChange: (open: boolean) => void
}

export const TaskCreateModal = ({ open, handleOpenChange }: TaskCreateModalProps) => {
  const { t } = useTranslation()
  const taskCreateMutation = useMutation(taskMutations.create())

  const defaultValues: TaskCreateFormValues = {
    title: '',
    description: '',
    priority: '',
    dueAt: '',
  }

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: TaskCreateFormSchema,
      onSubmit: TaskCreateFormSchema,
    },
    onSubmit: async ({ value }) => {
      await taskCreateMutation.mutateAsync(toTaskCreateRequestBody(value))
      toast.success(t('task.created'))
      // 送信成功時のみフォームをリセット、送信失敗時は再度modalを開いた場合前回の入力値が残る
      form.reset()
      handleOpenChange(false)
    },
  })

  return (
    <Modal
      title={t('task.modal.createTitle')}
      open={open}
      onOpenChange={handleOpenChange}
      showCloseButton={true}
      dismissible={true}
    >
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

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('task.actions.saving') : t('common.save')}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </Modal>
  )
}
