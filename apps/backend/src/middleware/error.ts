import type { ErrorHandler } from 'hono'
import { AppError } from '../errors/app-error.js'
import { logger } from '../logger/index.js'

export const onError: ErrorHandler = (err, c) => {
  const requestId = c.get('requestId')

  if (err instanceof AppError) {
    logger.warn({
      requestId,
      errorCode: err.code,
      status: err.status,
      message: err.message,
    })

    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
          ...(err.details !== undefined ? { details: err.details } : {}),
        },
      },
      err.status,
    )
  }

  logger.error({
    requestId,
    errorCode: 'INTERNAL_SERVER_ERROR',
    err,
  })

  return c.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    },
    500,
  )
}
