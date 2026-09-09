import { useMutation } from '@tanstack/react-query'
import { Button } from 'otsukimi-ui'
import { toast } from 'sonner'
import { useAppForm } from '@/components/form/form'
import type { AdminUserDetail } from '../api'
import { adminMutations } from '../mutation'
import {
  AdminUserRoleEditFormSchema,
  type AdminUserRoleEditFormValues,
  toAdminUserRoleUpdateRequestBody,
} from '../schema'
import { useTranslation } from 'react-i18next'

interface UserEditRoleInfoProps {
  user: AdminUserDetail
  onBack: () => void
}

export const UserEditRoleInfo = ({ user, onBack }: UserEditRoleInfoProps) => {
  const { t } = useTranslation()
  const adminUserUpdateMutation = useMutation(adminMutations.updateRole())

  const form = useAppForm({
    defaultValues: {
      role: user.role as AdminUserRoleEditFormValues['role'],
    },
    validators: {
      onChange: AdminUserRoleEditFormSchema,
      onSubmit: AdminUserRoleEditFormSchema,
    },
    onSubmit: async ({ value }) => {
      await adminUserUpdateMutation.mutateAsync({
        userId: user.id,
        input: toAdminUserRoleUpdateRequestBody(value),
      })
      toast.success(t('admin.updatedRole'))
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
        <form.AppField name="role">
          {(field) => (
            <field.SelectField
              label={t('admin.editRole.role')}
              options={[
                { label: 'admin', value: 'admin' },
                { label: 'user', value: 'user' },
              ]}
            />
          )}
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
