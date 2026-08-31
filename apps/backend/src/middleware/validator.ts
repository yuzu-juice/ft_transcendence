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

type ValidationTarget = 'json' | 'query' | 'param'

export const validate = <const Target extends ValidationTarget, Schema extends z.ZodType>(
  target: Target,
  schema: Schema,
) => {
  return zValidator(target, schema, validationHook)
}
