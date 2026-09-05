import z from 'zod'

export const AdminUserUpdateSchema = z.object({
  name: z.string().min(1).max(100),
})

export type AdminUserUpdateInput = z.infer<typeof AdminUserUpdateSchema>

export const AdminUserUpdateRoleSchema = z.object({
  role: z.enum(['admin', 'user']),
})

export type AdminUserUpdateRoleInput = z.infer<typeof AdminUserUpdateRoleSchema>
