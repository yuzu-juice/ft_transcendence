import { Button } from 'otsukimi-ui'
import type { User } from '../api'
import { useAppForm } from '@/components/form/form'
import { AdminUserUpdateSchema } from '../schema'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { adminMutations } from '../mutation'

interface UserEditInfoProps {
  user: User
  onBack: () => void
}

export const UserEditInfo = ({ user, onBack }: UserEditInfoProps) => {
  const adminUserUpdateMutation = useMutation(adminMutations.update())

  const form = useAppForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onChange: AdminUserUpdateSchema,
      onSubmit: AdminUserUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      await adminUserUpdateMutation.mutateAsync({
        userId: user.id,
        input: {
          name: value.name,
        },
      })
      toast.success('ユーザ情報を更新しました')
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
        <form.AppField name="name">
          {(field) => <field.TextField type="text" label="ユーザ名" />}
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
