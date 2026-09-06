// @ts-nocheck

import { authClient } from '@/lib/auth/client'

export async function registerAccountTools(signal: AbortSignal) {
  if (!document.modelContext) return

  await document.modelContext.registerTool(
    {
      name: 'get_my_account',
      title: '自分のアカウント情報を取得',
      description: 'Retrieve information about the currently signed-in user.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        untrustedContentHint: true,
      },
      async execute(_, { signal }) {
        const { data, error } = await authClient.getSession({
          fetchOptions: {
            signal,
          },
        })

        if (error) {
          throw new Error(error.message ?? 'Failed to get account')
        }
        if (!data) {
          throw new Error('Not authenticated')
        }
        return data.user
      },
    },
    { signal },
  )
}
