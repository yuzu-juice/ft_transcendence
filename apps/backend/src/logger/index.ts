import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'
import { env } from '../config/env.js'

// Elastic Common Schema（ECS）形式にフォーマット
export const logger = pino({
  ...ecsFormat(),
  level: env.LOG_LEVEL,
})
