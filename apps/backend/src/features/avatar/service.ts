import { avatarKeyFromUrl, avatarUrl, removeAvatar, storeAvatar } from './storage.js'
import { userRepository } from '../user/repository.js'
import { AppError } from '../../errors/app-error.js'

export const avatarService = {
  update: async (userId: string, input: Uint8Array, avatarDir: string) => {
    const oldImage = await userRepository.findImageById(userId)

    if (oldImage === undefined) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    const newKey = await storeAvatar(input, avatarDir)
    const newImage = avatarUrl(newKey)

    try {
      const updated = await userRepository.updateImage(userId, newImage)

      if (!updated) {
        throw new AppError('USER_NOT_FOUND', 404, 'User not found')
      }
    } catch (error) {
      await removeAvatar(newKey, avatarDir).catch(() => {})
      throw error
    }

    const oldKey = avatarKeyFromUrl(oldImage)

    if (oldKey !== null) {
      await removeAvatar(oldKey, avatarDir).catch((error) => {
        console.error('Failed to remove old avatar', error)
      })
    }

    return newImage
  },

  remove: async (userId: string, avatarDir: string): Promise<void> => {
    const oldImage = await userRepository.findImageById(userId)

    if (oldImage === undefined) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    if (oldImage === null) {
      return
    }

    const updated = await userRepository.updateImage(userId, null)

    if (updated === null) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    const oldKey = avatarKeyFromUrl(oldImage)

    if (oldKey !== null) {
      await removeAvatar(oldKey, avatarDir).catch((error) => {
        console.error('Failed to remove avatar', error)
      })
    }
  },
}
