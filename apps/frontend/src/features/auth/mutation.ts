import { authClient } from '@/lib/auth/client'
import { mutationOptions } from '@tanstack/react-query'
import type { SignInInput, SignUpInput } from './schema'
import i18n from '@/lib/i18n/config'

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
  if (error instanceof BetterAuthError) {
    if (error.status !== undefined && error.status >= 500) {
      return i18n.t('auth.error.serverUnavailable')
    }

    switch (error.code) {
      case 'INVALID_EMAIL_OR_PASSWORD':
      case 'INVALID_CREDENTIALS':
        return i18n.t('auth.error.invalidCredentials')
      case 'USER_ALREADY_EXISTS':
      case 'EMAIL_ALREADY_EXISTS':
        return i18n.t('auth.error.emailAlreadyUsed')
      case 'INVALID_EMAIL':
        return i18n.t('auth.error.invalidEmail')
      case 'WEAK_PASSWORD':
      case 'PASSWORD_TOO_SHORT':
        return i18n.t('auth.error.weakPassword')
      default:
        if (error.status === 401) {
          return i18n.t('auth.error.invalidCredentials')
        }
        if (error.status === 409) {
          return i18n.t('auth.error.emailAlreadyUsed')
        }
    }
  }

  return i18n.t('auth.error.signInFailed')
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
