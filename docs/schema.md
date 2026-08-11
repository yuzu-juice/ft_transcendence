データベースのスキーマの正本は、Drizzle schemaとします。
本ファイルは、要件定義を実施するため一時的にデータベースのスキーマを定義したものです。

```
Project ft_transcendence {
  database_type: "PostgreSQL"

  Note: '''
  Logical database schema.

  Source of truth:
    - Drizzle schema
    - Drizzle migrations

  Better Auth tables are generated from
  the Better Auth configuration.
  '''
}

Enum task_status {
  todo
  in_progress
  done
}

Enum task_priority {
  low
  medium
  high
}

Table user {
  id text [pk]

  name text [not null]
  email text [not null, unique]
  emailVerified boolean [not null]

  image text

  role text [
    not null,
    default: "user",
    note: "user | admin"
  ]

  createdAt timestamptz [not null]
  updatedAt timestamptz [not null]

  Note: '''
  Managed primarily by Better Auth.
  role is an application-specific field.
  '''
}

Table session {
  id text [pk]
  userId text [not null]
  token text [not null, unique]
  expiresAt timestamptz [not null]

  ipAddress text
  userAgent text

  createdAt timestamptz [not null]
  updatedAt timestamptz [not null]

  Note: "Managed by Better Auth."
}

Table account {
  id text [pk]

  userId text [not null]

  accountId text [not null]
  providerId text [not null]

  password text

  createdAt timestamptz [not null]
  updatedAt timestamptz [not null]

  Note: '''
  Managed by Better Auth.

  Initial implementation uses this table
  for email/password credentials.
  The actual generated Better Auth table
  may contain additional nullable fields.
  '''
}

Table verification {
  id text [pk]

  identifier text [not null]
  value text [not null]
  expiresAt timestamptz [not null]

  createdAt timestamptz [not null]
  updatedAt timestamptz [not null]

  Note: "Managed by Better Auth."
}

Table task {
  id text [pk]

  title text [
    not null,
    note: "1-200 characters"
  ]

  description text [
    note: "Maximum 2000 characters"
  ]

  status task_status [
    not null,
    default: "todo",
  ]

  priority task_priority

  dueDate timestamptz

  createdBy text [
    note: "NULL when creator account has been deleted"
  ]

  createdAt timestamptz [not null]
  updatedAt timestamptz [not null]

  indexes {
    createdBy
    dueDate
  }
}

Table task_assignment {
  taskId text [not null]
  userId text [not null]

  assignedAt timestamptz [not null]

  indexes {
    (taskId, userId) [pk]
    userId
  }
}

Ref: session.userId > user.id [delete: cascade]
Ref: account.userId > user.id [delete: cascade]

Ref: task.createdBy > user.id [delete: set null]

Ref: task_assignment.taskId > task.id [delete: cascade]
Ref: task_assignment.userId > user.id [delete: cascade]
```
