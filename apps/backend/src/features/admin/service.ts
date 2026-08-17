import { DatabaseError } from 'pg'
import { auth } from '../../auth/index.js'
import { AppError } from '../../errors/app-error.js'
import { type AdminUpdateUser, adminRepository, type SearchUser } from './repository.js'

function isUniqueViolation(err: unknown): err is DatabaseError {
  return err instanceof DatabaseError && err.code === '23505'
}

export const adminService = {
  search: async (input: SearchUser) => {
    return await adminRepository.search(input)
  },

  get: async (userId: string) => {
    const user = await adminRepository.findById(userId)

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    return user
  },

  update: async (userId: string, input: AdminUpdateUser) => {
    try {
      const user = await adminRepository.update(userId, input)

      if (!user) {
        throw new AppError('USER_NOT_FOUND', 404, 'User not found')
      }

      return user
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new AppError('EMAIL_ALREADY_EXISTS', 409, 'Email address is already in use')
      }

      throw err
    }
  },

  setRole: async (userId: string, executorId: string, role: 'admin' | 'user', headers: Headers) => {
    if (userId === executorId) {
      throw new AppError(
        'ADMIN_SELF_DEMOTION_NOT_ALLOWED',
        409,
        'An administrator cannot demote their own account',
      )
    }

    const user = await adminRepository.setRole(userId, role)

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    await auth.api.revokeUserSessions({
      body: {
        userId,
      },
      headers,
    })

    return user
  },

  remove: async (userId: string, executorId: string, headers: Headers) => {
    if (userId === executorId) {
      throw new AppError(
        'ADMIN_SELF_DELETE_NOT_ALLOWED',
        409,
        'An administrator cannot delete their own account',
      )
    }

    const user = await adminRepository.findById(userId)

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    await auth.api.removeUser({
      body: {
        userId,
      },
      headers,
    })
  },
}
