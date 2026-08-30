import { authClient } from '@/lib/auth/client'
import { ProfileUpdateSchema } from '../schema'
import { useMutation } from '@tanstack/react-query'
import { profileUploadMutationOptions } from '../mutation'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Button } from 'otsukimi-ui'
import { useAppForm } from '@/components/form/form'

interface ProfileEditModalProps {
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProfileEditModal = ({ name, open, onOpenChange }: ProfileEditModalProps) => {
  const { refetch } = authClient.useSession()

  const profileUpdateMutation = useMutation(profileUploadMutationOptions)

  const form = useAppForm({
    defaultValues: {
      name: name,
    },
    validators: {
      onChange: ProfileUpdateSchema,
      onSubmit: ProfileUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      await profileUpdateMutation.mutateAsync(value)
      await refetch()
      toast.success('ユーザ名を更新しました')
      onOpenChange(false)
    },
  })

  return (
    <Modal open={open} title="プロフィール編集" onOpenChange={onOpenChange}>
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
          {(field) => <field.TextField label="ユーザ名" type="text" className="!w-full" />}
        </form.AppField>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '保存しています...' : '保存'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Modal>
  )
}
