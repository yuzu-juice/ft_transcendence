import { z } from 'zod'

export const searchAdminUserSchema = z.object({
  q: z.string().max(200).optional(),
  role: z.enum(['admin', 'user']).optional(),
})

export type SearchAdminUserInput = z.infer<typeof searchAdminUserSchema>

export const userIdParamSchema = z.object({
  userId: z.string(),
})

export type UserIdParamInput = z.infer<typeof userIdParamSchema>

export const patchAdminUserSchema = z.object({
  name: z.string().min(1).max(100),
})

export type PatchAdminUserInput = z.infer<typeof patchAdminUserSchema>

export const patchUserRoleSchema = z.object({
  role: z.enum(['admin', 'user']),
})

export type PatchUserRoleInput = z.infer<typeof patchUserRoleSchema>
