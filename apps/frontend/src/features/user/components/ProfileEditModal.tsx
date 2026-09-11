import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import { Modal } from '@/components/ui/Modal'
import { authClient } from '@/lib/auth/client'
import { profileUploadMutationOptions } from '../mutation'
import { ProfileUpdateSchema } from '../schema'

interface ProfileEditModalProps {
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProfileEditModal = ({ name, open, onOpenChange }: ProfileEditModalProps) => {
  const { t } = useTranslation()
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
      try {
        await profileUpdateMutation.mutateAsync(value)
        await refetch()
        toast.success(t('user.profile.updated'))
        onOpenChange(false)
      } catch {}
    },
  })

  return (
    <Modal
      open={open}
      title={t('user.profile.editModalTitle')}
      onOpenChange={onOpenChange}
      showCloseButton={true}
      dismissible={true}
    >
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
          {(field) => (
            <field.TextField label={t('user.profile.nameLabel')} type="text" className="!w-full" />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('user.profile.saving') : t('common.save')}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </Modal>
  )
}
