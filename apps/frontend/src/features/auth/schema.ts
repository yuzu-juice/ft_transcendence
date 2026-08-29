import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export type SignInInput = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'ユーザ名を入力してください')
      .max(100, 'ユーザ名は100文字以内で入力してください'),
    email: z.email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string().min(1, '確認用パスワードを入力してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '確認用パスワードが一致しません',
    path: ['confirmPassword'],
  })

export type SignUpInput = z.infer<typeof SignUpSchema>
