import { Modal } from '@/components/ui/Modal'
import { Button, Divider } from 'otsukimi-ui'
import { AvatarUploadSchema } from '../schema'
import { useMutation } from '@tanstack/react-query'
import { avatarDeleteMutationOptions, avatarUploadMutationOptions } from '../mutation'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/client'
import { getFormErrorMessage, useAppForm } from '@/components/form/form'

interface AvatarEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AvatarEditModal = ({ open, onOpenChange }: AvatarEditModalProps) => {
  const { refetch } = authClient.useSession()

  const avatarUploadMutation = useMutation(avatarUploadMutationOptions)
  const avatarDeleteMutation = useMutation(avatarDeleteMutationOptions)

  const editForm = useAppForm({
    defaultValues: {
      avatar: null as File | null,
    },
    validators: {
      onBlur: AvatarUploadSchema,
      onSubmit: AvatarUploadSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.avatar) return

      await avatarUploadMutation.mutateAsync({
        avatar: value.avatar,
      })
      await refetch()
      toast.success('アバター画像を更新しました') // TODO toastがmodalの裏に隠れてしまう問題を修正
      onOpenChange(false)
    },
  })

  const deleteForm = useAppForm({
    onSubmit: async () => {
      await avatarDeleteMutation.mutateAsync()
      await refetch()
      toast.success('アバター画像を削除しました')
      onOpenChange(false)
    },
  })

  return (
    <Modal open={open} title="アバター編集" onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-md font-bold">画像を更新</h3>
          <form
            noValidate
            className="flex flex-row gap-12"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              editForm.handleSubmit()
            }}
          >
            <editForm.AppField name="avatar">
              {(field) => (
                <div className="flex flex-col gap-1 w-full">
                  <input
                    type="file"
                    className="block w-full text-sm bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none
         file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold
         file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    accept="image/jpeg, image/jpg, image/png, image/webp"
                    onChange={(e) => {
                      field.handleChange(e.target.files?.[0] ?? null)
                    }}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-600">
                      {getFormErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </editForm.AppField>

            <editForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'アップロードしています...' : 'アップロード'}
                </Button>
              )}
            </editForm.Subscribe>
          </form>
        </div>
        <Divider />
        <div className="flex flex-col gap-2">
          <h3 className="text-md font-bold">画像を削除</h3>
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? '削除しています...' : '画像を削除する'}
                </Button>
              )}
            </deleteForm.Subscribe>
          </form>
        </div>
      </div>
    </Modal>
  )
}
