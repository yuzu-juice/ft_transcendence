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

export const patchAdminUserSchema = z
  .object({
    email: z.string().optional(),
    name: z.string().min(1).max(100).optional(),
  })
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: 'You must enter a value in at least one field.',
  })

export type PatchAdminUserInput = z.infer<typeof patchAdminUserSchema>

export const patchUserRoleSchema = z.object({
  role: z.enum(['admin', 'user']),
})

export type PatchUserRoleInput = z.infer<typeof patchUserRoleSchema>
