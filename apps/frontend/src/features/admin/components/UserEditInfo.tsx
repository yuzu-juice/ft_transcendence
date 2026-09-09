import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import type { AdminUserDetail } from '../api'
import { adminMutations } from '../mutation'
import { AdminUserEditFormSchema, toAdminUserUpdateRequestBody } from '../schema'
import { useTranslation } from 'react-i18next'

interface UserEditInfoProps {
  user: AdminUserDetail
  onBack: () => void
}

export const UserEditInfo = ({ user, onBack }: UserEditInfoProps) => {
  const { t } = useTranslation()
  const adminUserUpdateMutation = useMutation(adminMutations.update())

  const form = useAppForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onChange: AdminUserEditFormSchema,
      onSubmit: AdminUserEditFormSchema,
    },
    onSubmit: async ({ value }) => {
      await adminUserUpdateMutation.mutateAsync({
        userId: user.id,
        input: toAdminUserUpdateRequestBody(value),
      })
      toast.success(t('admin.updatedInfo'))
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
          {(field) => <field.TextField type="text" label={t('admin.editInfo.userName')} />}
        </form.AppField>

        <div className="flex flex-row gap-4">
          <Button type="button" onClick={() => onBack()} variant="transparent">
            {t('common.cancel')}
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('admin.actions.saving') : t('common.save')}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
