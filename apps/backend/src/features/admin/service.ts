import { adminRepository, type AdminUpdateUser, type SearchUser } from './repository.js'
import { AppError } from '../../errors/app-error.js'
import { DatabaseError } from 'pg'
import type { AuthEnv } from '../../middleware/auth.js'

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
}
