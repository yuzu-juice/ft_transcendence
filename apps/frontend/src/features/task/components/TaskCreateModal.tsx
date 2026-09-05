import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { Modal } from '@/components/ui/Modal'
import { taskMutations } from '../mutation'
import { TaskCreateFormSchema, type TaskCreateFormValues, toTaskCreateRequestBody } from '../schema'

interface TaskCreateModalProps {
  open: boolean
  handleOpenChange: (open: boolean) => void
}

export const TaskCreateModal = ({ open, handleOpenChange }: TaskCreateModalProps) => {
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
      toast.success('タスクを作成しました')
      // 送信成功時のみフォームをリセット、送信失敗時は再度modalを開いた場合前回の入力値が残る
      form.reset()
      handleOpenChange(false)
    },
  })

  return (
    <Modal
      title="タスク作成"
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
            {(field) => <field.TextField type="text" label="タイトル" />}
          </form.AppField>

          <form.AppField name="description">
            {(field) => <field.TextAreaField label="説明" />}
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

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '保存しています...' : '保存'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </Modal>
  )
}
