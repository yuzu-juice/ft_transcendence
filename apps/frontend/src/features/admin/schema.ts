import z from 'zod'

export const AdminUserUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'ユーザ名を入力してください')
    .max(100, 'ユーザ名は100文字以内で入力してください'),
})

export type AdminUserUpdateInput = z.infer<typeof AdminUserUpdateSchema>

export const AdminUserUpdateRoleSchema = z.object({
  role: z.enum(['admin', 'user']),
})

export type AdminUserUpdateRoleInput = z.infer<typeof AdminUserUpdateRoleSchema>
