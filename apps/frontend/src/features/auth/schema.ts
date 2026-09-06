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
    agreement: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '確認用パスワードが一致しません',
    path: ['confirmPassword'],
  })
  .refine((data) => data.agreement === true, {
    message: '利用規約・プライバシーポリシーへの同意が必須です',
    path: ['agreement'],
  })

export type SignUpInput = z.infer<typeof SignUpSchema>

// GitHub OAuth / TOTPのエラーコールバックを解釈する用途に使用
export const SignInSearchSchema = z.object({
  error: z.string().optional(),
  oauth: z.string().optional(),
})

export const TotpEnableSchema = z.object({
  password: z.string().min(1, 'パスワードを入力してください'),
})

export type TotpEnableInput = z.infer<typeof TotpEnableSchema>

export const TotpCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, '6桁の数字を入力してください'),
})

export type TotpCodeInput = z.infer<typeof TotpCodeSchema>
