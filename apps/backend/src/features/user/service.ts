import { AppError } from '../../errors/app-error.js'
import { userRepository } from './repository.js'

export type UserSummary = {
  id: string
  name: string
  image: string | null
}

export const userService = {
  list: async () => {
    return await userRepository.findAll()
  },

  get: async (userId: string) => {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    return user
  },

  update: async (userId: string, name: string) => {
    const user = await userRepository.update(userId, name)

    if (!user) {
      throw new AppError('USER_NOT_FOUND', 404, 'User not found')
    }

    return user
  },
}
