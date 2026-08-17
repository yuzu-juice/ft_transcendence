import { auth } from '../src/auth/index.js'
import { task, taskAssignment } from '../src/db/schema/tasks.js'
import { db } from '../src/db/index.js'
import { pool } from '../src/db/index.js'

if (process.env.NODE_ENV === 'production') {
  throw new Error('seed-dev must not run in production')
}

// Check if the user for seeding exists.
// Do not execute if the user already exists.

const DEV_SEED_EMAIL = 'dev-user-1@example.test'

const seeded = await db.query.user.findFirst({
  where: {
    email: DEV_SEED_EMAIL,
  },
})

if (seeded) {
  console.log('Development seed already exists. Skipping.')
  process.exit(0)
}

await auth.api.signUpEmail({
  body: {
    name: 'Dev User 1',
    email: DEV_SEED_EMAIL,
    password: 'password123',
  },
})

// Create a test user.

const seedUsers = [
  {
    name: 'Alice',
    email: 'alice@example.test',
    password: 'password123',
  },
  {
    name: 'Bob',
    email: 'bob@example.test',
    password: 'password123',
  },
  {
    name: 'Carol',
    email: 'carol@example.test',
    password: 'password123',
  },
]

const users = []

for (const seedUser of seedUsers) {
  const result = await auth.api.signUpEmail({ body: seedUser })
  users.push(result.user)
}

const usersByName = new Map(users.map((user) => [user.name, user]))

const alice = usersByName.get('Alice')!
const bob = usersByName.get('Bob')!
const carol = usersByName.get('Carol')!

// Create a dummy task.

const tasks = await db
  .insert(task)
  .values([
    {
      title: 'Task 1',
      description: 'Todo / High / Alice created / future due',
      status: 'todo',
      priority: 'high',
      createdBy: alice.id,
      dueAt: new Date('2026-12-31T00:00:00Z'),
    },
    {
      title: 'Task 2',
      description: 'In progress / Medium / Bob created / overdue',
      status: 'in_progress',
      priority: 'medium',
      createdBy: bob.id,
      dueAt: new Date('2026-07-31T00:00:00Z'),
    },
    {
      title: 'Task 3',
      description: 'Done / Low / Alice created / far future',
      status: 'done',
      priority: 'low',
      createdBy: alice.id,
      dueAt: new Date('2030-09-12T21:00:00Z'),
    },
    {
      title: 'Task 4',
      description: 'Done / No priority / No creator / No due date',
      status: 'done',
      priority: null,
      createdBy: null,
      dueAt: null,
    },
    {
      title: 'Task 5',
      description: null,
      status: 'todo',
      priority: null,
      createdBy: bob.id,
      dueAt: null,
    },
    {
      title: 'Task 6',
      description: 'Todo / Low / Carol created',
      status: 'todo',
      priority: 'low',
      createdBy: carol.id,
      dueAt: new Date('2026-08-18T12:00:00Z'),
    },
    {
      title: 'Task 7',
      description: 'In progress / High / Alice created',
      status: 'in_progress',
      priority: 'high',
      createdBy: alice.id,
      dueAt: null,
    },
    {
      title: 'Task 8',
      description: 'In progress / No priority / Carol created',
      status: 'in_progress',
      priority: null,
      createdBy: carol.id,
      dueAt: new Date('2026-10-01T00:00:00Z'),
    },
    {
      title: 'Task 9',
      description: 'Done / Medium / Bob created',
      status: 'done',
      priority: 'medium',
      createdBy: bob.id,
      dueAt: new Date('2026-08-01T00:00:00Z'),
    },
  ])
  .returning()

await db.insert(taskAssignment).values([
  // Task 1:
  // 作成者本人だけが担当
  {
    taskId: tasks[0].id,
    userId: alice.id,
  },

  // Task 2:
  // 作成者とは別の1人だけが担当
  {
    taskId: tasks[1].id,
    userId: alice.id,
  },

  // Task 3:
  // 複数人が担当。作成者も含む
  {
    taskId: tasks[2].id,
    userId: alice.id,
  },
  {
    taskId: tasks[2].id,
    userId: bob.id,
  },

  // Task 4:
  // createdBy は null だが担当者は存在する
  {
    taskId: tasks[3].id,
    userId: carol.id,
  },

  // Task 5:
  // 担当者なし

  // Task 6:
  // 作成者とは異なる複数人が担当
  {
    taskId: tasks[5].id,
    userId: alice.id,
  },
  {
    taskId: tasks[5].id,
    userId: bob.id,
  },

  // Task 7:
  // 全員担当
  {
    taskId: tasks[6].id,
    userId: alice.id,
  },
  {
    taskId: tasks[6].id,
    userId: bob.id,
  },
  {
    taskId: tasks[6].id,
    userId: carol.id,
  },

  // Task 8:
  // 作成者本人ではない1人
  {
    taskId: tasks[7].id,
    userId: bob.id,
  },

  // Task 9:
  // 作成者本人 + 別ユーザー
  {
    taskId: tasks[8].id,
    userId: bob.id,
  },
  {
    taskId: tasks[8].id,
    userId: carol.id,
  },
])

console.log(`Seed accounts and tasks created`)

await pool.end()
