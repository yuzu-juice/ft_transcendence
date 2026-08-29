import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export type SignInInput = z.infer<typeof SignInSchema>
