import { ecsFormat } from '@elastic/ecs-pino-format'
import pino from 'pino'

// Elastic Common Schema（ECS）形式にフォーマット
export const logger = pino({
  ...ecsFormat(),
  level: process.env.LOG_LEVEL ?? 'info',
})
