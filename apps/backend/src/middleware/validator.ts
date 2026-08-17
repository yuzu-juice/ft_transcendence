import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { AppError } from '../errors/app-error.js'

const validationHook = (result: any) => {
  if (!result.success) {
    const { fieldErrors, formErrors } = z.flattenError(result.error)

    throw new AppError('VALIDATION_ERROR', 400, 'Invalid request', {
      fieldErrors,
      formErrors,
    })
  }
}

export const validate = <T extends z.ZodType>(target: 'json' | 'query' | 'param', schema: T) => {
  return zValidator(target, schema, validationHook)
}
