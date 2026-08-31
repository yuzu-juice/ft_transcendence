import z from 'zod'

const AVATAR_MAX_FILE_SIZE = 4 * 1024 * 1024
const AVATAR_ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const AvatarUploadSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= AVATAR_MAX_FILE_SIZE, 'ファイルサイズは4MB以下にしてください')
    .refine(
      (file) => AVATAR_ACCEPTED_IMAGE_TYPES.includes(file.type),
      'jpeg, png, webp形式の画像を選択してください',
    ),
})

export type AvatarUploadInput = z.infer<typeof AvatarUploadSchema>

export const ProfileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'ユーザ名を入力してください')
    .max(100, 'ユーザ名は100文字以内で入力してください'),
})

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>
