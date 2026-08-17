import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { AppError } from '../errors/app-error.js'

export const validate = (target: 'json' | 'query' | 'param', schema: z.ZodType) =>
  zValidator(target, schema, (result) => {
    if (!result.success) {
      const { fieldErrors, formErrors } = z.flattenError(result.error)

      throw new AppError('VALIDATION_ERROR', 400, 'Invalid request', {
        fieldErrors,
        formErrors,
      })
    }
  })
