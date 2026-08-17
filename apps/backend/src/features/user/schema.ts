import { z } from 'zod'

export const patchMeSchema = z.object({
  name: z.string().min(1).max(100),
})

export type PatchMeInput = z.infer<typeof patchMeSchema>
