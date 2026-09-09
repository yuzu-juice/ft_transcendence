import z from 'zod'

const AVATAR_MAX_FILE_SIZE = 4 * 1024 * 1024
const AVATAR_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const AvatarUploadSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= AVATAR_MAX_FILE_SIZE, 'user.validation.avatar.fileTooLarge')
    .refine(
      (file) => AVATAR_ACCEPTED_IMAGE_TYPES.includes(file.type),
      'user.validation.avatar.unsupportedType',
    ),
})

export type AvatarUploadInput = z.infer<typeof AvatarUploadSchema>

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'user.validation.userName.required')
    .max(100, 'user.validation.userName.tooLong'),
})

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>
