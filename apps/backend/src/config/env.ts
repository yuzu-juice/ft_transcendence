import { z } from 'zod'

const EnvSchema = z
  .object({
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
    AVATAR_DIR: z.string().min(1),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  })
  .refine((env) => !!env.GITHUB_CLIENT_ID === !!env.GITHUB_CLIENT_SECRET, {
    message: 'GITHUB_CLIENT_IDとGITHUB_CLIENT_SECRETは同時に設定する必要があります',
  })

const result = EnvSchema.safeParse(process.env)

if (!result.success) {
  console.error('Invalid environment configuration')
  console.error(z.prettifyError(result.error))
  process.exit(1)
}

export const env = result.data
