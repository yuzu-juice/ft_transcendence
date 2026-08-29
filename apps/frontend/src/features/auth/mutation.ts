import { authClient } from '@/lib/auth/client'
import { mutationOptions } from '@tanstack/react-query'
import type { SignInInput, SignUpInput } from './schema'

export class BetterAuthError extends Error {
  readonly code?: string
  readonly status?: number
  constructor(message?: string, code?: string, status?: number) {
    super(message)
    this.name = 'BetterAuthError'
    this.code = code
    this.status = status
  }
}

export const getBetterAuthErrorMessage = (error: unknown): string => {
  if (error instanceof BetterAuthError && error.status !== undefined && error.status >= 500) {
    return 'サーバとの通信に失敗しました。再度お試しください'
  }
  if (error instanceof BetterAuthError && error.message) {
    // Better Authのエラーメッセージを露出している
    // i18n化する際にはバックエンド側の設定含め変更する必要がある
    return error.message
  }
  return 'ログインに失敗しました'
}

export const signInMutationOptions = mutationOptions({
  mutationKey: ['auth', 'sign-in'],
  mutationFn: async ({ email, password }: SignInInput) => {
    const { data, error } = await authClient.signIn.email({
      email: email.trim(),
      password,
    })
    if (error) {
      throw new BetterAuthError(error.message, error.code, error.status)
    }
    return data
  },
  meta: {
    suppressErrorToast: true,
  },
})

export const signUpMutationOptions = mutationOptions({
  mutationKey: ['auth', 'sign-up'],
  mutationFn: async ({ name, email, password }: SignUpInput) => {
    const { data, error } = await authClient.signUp.email({
      name,
      email: email.trim(),
      password,
    })
    if (error) {
      throw new BetterAuthError(error.message, error.code, error.status)
    }
    return data
  },
  meta: {
    suppressErrorToast: true,
  },
})
