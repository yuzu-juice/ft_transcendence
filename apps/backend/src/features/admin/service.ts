import { APIError } from 'better-auth'
import { auth } from '../../auth/index.js'
import { AppError } from '../../errors/app-error.js'
import { avatarKeyFromUrl, removeAvatar } from '../avatar/storage.js'
import { adminRepository, type SearchUser } from './repository.js'

function handleBetterAuthError(error: unknown) {
  if (error instanceof APIError) {
    switch (error.status) {
      case 'NOT_FOUND': {
        throw new AppError('USER_NOT_FOUND', 404, 'User not found')
      }
      default:
        throw error
    }
  }
  throw error
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

  setName: async (userId: string, name: string, headers: Headers) => {
    try {
      const user = await auth.api.adminUpdateUser({
        body: {
          userId,
          data: {
            name,
          },
        },
        headers,
      })

      return user
    } catch (error) {
      handleBetterAuthError(error)
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

    try {
      const user = await auth.api.setRole({
        body: {
          userId,
          role,
        },
        headers,
      })
      await auth.api.revokeUserSessions({
        body: {
          userId,
        },
        headers,
      })

      return user
    } catch (error) {
      handleBetterAuthError(error)
    }
  },

  remove: async (userId: string, executorId: string, avatarDir: string, headers: Headers) => {
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

    const imageKey = avatarKeyFromUrl(user.image!)

    if (imageKey !== null) {
      await removeAvatar(imageKey, avatarDir).catch((error) => {
        console.error('Failed to remove avatar', error)
      })
    }
  },
}
