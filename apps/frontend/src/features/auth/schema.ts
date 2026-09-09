import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.email('auth.validation.email.invalid'),
  password: z.string().min(1, 'auth.validation.password.required'),
})

export type SignInInput = z.infer<typeof SignInSchema>

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(1, 'auth.validation.userName.required')
      .max(100, 'auth.validation.userName.tooLong'),
    email: z.email('auth.validation.email.invalid'),
    password: z.string().min(8, 'auth.validation.password.minLength'),
    confirmPassword: z.string().min(1, 'auth.validation.confirmPassword.required'),
    agreement: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.validation.confirmPassword.mismatch',
    path: ['confirmPassword'],
  })
  .refine((data) => data.agreement === true, {
    message: 'auth.validation.agreement.required',
    path: ['agreement'],
  })

export type SignUpInput = z.infer<typeof SignUpSchema>

// GitHub OAuth / TOTPのエラーコールバックを解釈する用途に使用
export const SignInSearchSchema = z.object({
  error: z.string().optional(),
  oauth: z.string().optional(),
})

export const TotpEnableSchema = z.object({
  password: z.string().min(1, 'auth.validation.password.required'),
})

export type TotpEnableInput = z.infer<typeof TotpEnableSchema>

export const TotpCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'auth.validation.totpCode.format'),
})

export type TotpCodeInput = z.infer<typeof TotpCodeSchema>
