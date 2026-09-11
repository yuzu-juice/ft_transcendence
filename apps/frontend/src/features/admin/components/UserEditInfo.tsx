import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import type { AdminUserDetail } from '../api'
import { adminMutations } from '../mutation'
import { AdminUserEditFormSchema, toAdminUserUpdateRequestBody } from '../schema'

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
      try {
        await adminUserUpdateMutation.mutateAsync({
          userId: user.id,
          input: toAdminUserUpdateRequestBody(value),
        })
        toast.success(t('admin.updatedInfo'))
        onBack()
      } catch {}
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

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto">
          <Button
            type="button"
            onClick={() => onBack()}
            className="w-full sm:w-auto"
            variant="transparent"
          >
            {t('common.cancel')}
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? t('admin.actions.saving') : t('common.save')}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  )
}
