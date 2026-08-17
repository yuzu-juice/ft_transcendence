import { z } from 'zod'

export const avatarKeyParamSchema = z.object({
  avatarKey: z.uuid(),
})

export type AvatarKeyParamInput = z.infer<typeof avatarKeyParamSchema>
