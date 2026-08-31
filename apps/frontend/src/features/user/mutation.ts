import { mutationOptions } from '@tanstack/react-query'
import type { AvatarUploadInput, ProfileUpdateInput } from './schema'
import { parseResponse } from 'hono/client'
import { client } from '@/lib/api/client'

export const avatarUploadMutationOptions = mutationOptions({
  mutationKey: ['user', 'avatar', 'put'],
  mutationFn: async ({ avatar }: AvatarUploadInput) => {
    await parseResponse(
      client.me.avatar.$put({
        form: {
          avatar,
        },
      }),
    )
  },
})

export const avatarDeleteMutationOptions = mutationOptions({
  mutationKey: ['user', 'avatar', 'delete'],
  mutationFn: async () => {
    await parseResponse(client.me.avatar.$delete({}))
  },
})

export const profileUploadMutationOptions = mutationOptions({
  mutationKey: ['user', 'profile'],
  mutationFn: async ({ name }: ProfileUpdateInput) => {
    await parseResponse(
      client.me.$patch({
        json: {
          name,
        },
      }),
    )
  },
})
