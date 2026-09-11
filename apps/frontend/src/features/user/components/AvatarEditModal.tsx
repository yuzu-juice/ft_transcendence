import { useMutation } from '@tanstack/react-query'
import { Button, Divider } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { FormErrorMessage } from '@/components/form/FormErrorMessage'
import { useAppForm } from '@/components/form/form'
import { Modal } from '@/components/ui/Modal'
import { authClient } from '@/lib/auth/client'
import { avatarDeleteMutationOptions, avatarUploadMutationOptions } from '../mutation'
import { AvatarUploadSchema } from '../schema'

interface AvatarEditModalProps {
  hasAvatarImage: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AvatarEditModal = ({ hasAvatarImage, open, onOpenChange }: AvatarEditModalProps) => {
  const { t } = useTranslation()
  const { refetch } = authClient.useSession()

  const avatarUploadMutation = useMutation(avatarUploadMutationOptions)
  const avatarDeleteMutation = useMutation(avatarDeleteMutationOptions)

  const editForm = useAppForm({
    defaultValues: {
      avatar: null as File | null,
    },
    validators: {
      onChange: AvatarUploadSchema,
      onSubmit: AvatarUploadSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.avatar) {
        return
      }

      await avatarUploadMutation.mutateAsync({
        avatar: value.avatar,
      })
      await refetch()
      toast.success(t('user.avatar.updated')) // TODO toastがmodalの裏に隠れてしまう問題を修正
      onOpenChange(false)
    },
  })

  const deleteForm = useAppForm({
    onSubmit: async () => {
      await avatarDeleteMutation.mutateAsync()
      await refetch()
      toast.success(t('user.avatar.deleted'))
      onOpenChange(false)
    },
  })

  return (
    <Modal
      open={open}
      title={t('user.avatar.editModalTitle')}
      onOpenChange={onOpenChange}
      showCloseButton={true}
      dismissible={true}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-md font-bold">{t('user.avatar.updateTitle')}</h3>
          <form
            noValidate
            className="flex flex-col gap-8"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              editForm.handleSubmit()
            }}
          >
            <editForm.AppField name="avatar">
              {(field) => (
                <div className="flex flex-col gap-1 w-full">
                  <div className="w-full h-[3em] rounded-md flex flex-row items-center gap-4 border border-border">
                    <span className="pl-4 flex-1 truncate">
                      {field.state.value?.name ?? t('user.avatar.unselectedMessage')}
                    </span>
                    <label className="h-full flex items-center bg-brand-primary-soft border-l-brand-primary-deep pl-4 pr-6 rounded-r-md cursor-pointer">
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/jpeg, image/jpg, image/png, image/webp"
                        onChange={(e) => {
                          field.handleChange(e.target.files?.[0] ?? null)
                        }}
                      />
                      <span className="">{t('user.avatar.select')}</span>
                    </label>
                  </div>

                  {field.state.meta.isTouched && !field.state.meta.isValid && (
                    <FormErrorMessage error={field.state.meta.errors[0]} />
                  )}
                </div>
              )}
            </editForm.AppField>

            <editForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t('user.avatar.uploading') : t('user.avatar.upload')}
                </Button>
              )}
            </editForm.Subscribe>
          </form>
        </div>
        {hasAvatarImage && (
          <>
            <Divider />
            <div className="flex flex-col gap-2">
              <h3 className="text-md font-bold">{t('user.avatar.deleteTitle')}</h3>
              <form
                noValidate
                className="flex flex-row gap-12"
                onSubmit={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  deleteForm.handleSubmit()
                }}
              >
                <deleteForm.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <Button type="submit" variant="moon" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t('user.avatar.deleting') : t('user.avatar.delete')}
                    </Button>
                  )}
                </deleteForm.Subscribe>
              </form>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
