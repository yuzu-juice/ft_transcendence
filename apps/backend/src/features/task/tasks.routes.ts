import { Hono } from 'hono'
import type { AuthEnv } from '../../middleware/auth.js'
import { validate } from '../../middleware/validator.js'
import {
  createTaskSchema,
  patchTaskSchema,
  putTaskAssigneesSchema,
  searchTaskSchema,
  taskIdParamSchema,
} from './schema.js'
import { taskService } from './service.js'

export const tasks = new Hono<AuthEnv>()
  .get('/', validate('query', searchTaskSchema), async (c) => {
    const input = c.req.valid('query')

    const tasks = await taskService.search(input)

    return c.json(tasks)
  })
  .post('/', validate('json', createTaskSchema), async (c) => {
    const { id } = c.get('user')!
    const { title, description, priority, dueAt } = c.req.valid('json')

    const task = await taskService.create({
      title,
      description: description ?? null,
      priority: priority ?? null,
      createdBy: id,
      dueAt: dueAt ?? null,
    })

    return c.json(task, 201)
  })
  .get('/:taskId', validate('param', taskIdParamSchema), async (c) => {
    const { taskId } = c.req.valid('param')

    const task = await taskService.get(taskId)

    return c.json(task)
  })
  .patch(
    '/:taskId',
    validate('param', taskIdParamSchema),
    validate('json', patchTaskSchema),
    async (c) => {
      const { taskId } = c.req.valid('param')
      const { title, description, status, priority, dueAt } = c.req.valid('json')

      const task = await taskService.update(taskId, { title, description, status, priority, dueAt })

      return c.json(task)
    },
  )
  .delete('/:taskId', validate('param', taskIdParamSchema), async (c) => {
    const { taskId } = c.req.valid('param')
    const { id: userId, role } = c.get('user')!

    await taskService.delete(taskId, userId, role === 'admin')

    return c.body(null, 204)
  })
  .put(
    '/:taskId/assignees',
    validate('param', taskIdParamSchema),
    validate('json', putTaskAssigneesSchema),
    async (c) => {
      const { taskId } = c.req.valid('param')
      const { userIds } = c.req.valid('json')

      const task = await taskService.updateAssignees(taskId, userIds)

      return c.json(task)
    },
  )

export type InternalTasksAppType = typeof tasks
