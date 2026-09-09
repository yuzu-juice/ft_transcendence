import z from 'zod'
import type { AdminUserRoleUpdateRequestBody, AdminUserUpdateRequestBody } from './api'

export const AdminUserEditFormSchema = z.object({
  name: z
    .string()
    .min(1, 'admin.validation.userName.required')
    .max(100, 'admin.validation.userName.tooLong'),
})

export type AdminUserEditFormValues = z.infer<typeof AdminUserEditFormSchema>

export const toAdminUserUpdateRequestBody = (
  form: AdminUserEditFormValues,
): AdminUserUpdateRequestBody => ({
  name: form.name,
})

export const AdminUserRoleEditFormSchema = z.object({
  role: z.enum(['admin', 'user']),
})

export type AdminUserRoleEditFormValues = z.infer<typeof AdminUserRoleEditFormSchema>

export const toAdminUserRoleUpdateRequestBody = (
  form: AdminUserRoleEditFormValues,
): AdminUserRoleUpdateRequestBody => ({
  role: form.role,
})
