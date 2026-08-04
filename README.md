*This project has been created as part of the 42 curriculum by tamatsuu, ssoeno, genomoto, takitaga, <!-- login_name -->.*

---

## Description

<!-- TODO:
A “Description” section that clearly presents the project, including its goal and a
brief overview.
プロジェクトを進めつつ考える。
-->

**Key Features:**

- Task management with real-time updates
- Role-based access control (admin / user)
- Public API with Swagger documentation
- Multi-language support (Japanese, English, Chinese)
- OAuth login (GitHub)
- Progressive Web App support

---

## Team

| Login | Role | Responsibilities |
|---|---|---|
| <!-- login1 --> | Product Owner + Developer | <!-- TODO: 担当内容 --> |
| <!-- login2 --> | Project Manager + Developer | <!-- TODO: 担当内容 --> |
| <!-- login3 --> | Tech Lead + Developer | <!-- TODO: 担当内容 --> |
| <!-- login4 --> | Developer | <!-- TODO: 担当内容 --> |

---

## Project Management

<!-- TODO: 以下を埋める
- どうやってタスクを分担したか（GitHub Issues / Notion / etc.）
- ミーティングの頻度・方法
- コミュニケーションチャンネル（Discord）
-->

**Task organization:** We used [GitHub Projects](https://github.com/users/yuzu-juice/projects/3/views/2)
to manage tasks, track progress, and distribute work among team members.

**Meeting cadence:** <!-- TODO -->

**Communication:** <!-- TODO -->

---

## Instructions

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) 24 LTS or later
- [pnpm](https://pnpm.io/) 9 or later

```bash
npm install -g pnpm
```

### Setup

1. Clone the repository:

```bash
git clone <!-- TODO: リポジトリURL -->
cd <!-- TODO: リポジトリ名 -->
```

2. Copy the environment variables file and fill in the values:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the application (single command):

```bash
docker compose up --build
```

The application will be available at:
- Frontend: `https://localhost:5173`
- Backend API: `https://localhost:3000`
- API Documentation (Swagger UI): `https://localhost:3000/api/docs`

### Environment Variables

See `.env.example` for the full list of required variables.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth |
| `BETTER_AUTH_URL` | Base URL of the backend |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |

---

## Technical Stack

### Frontend

| Technology | Version | Reason |
|---|---|---|
| React | 19 | <!-- TODO: 選定理由 --> |
| Vite | latest | <!-- TODO: 選定理由 --> |
| Tailwind CSS | v4 | <!-- TODO: 選定理由 --> |
| TanStack Router | v1 | <!-- TODO: 選定理由 --> |
| TanStack Query | v5 | <!-- TODO: 選定理由 --> |
| react-i18next | latest | Multi-language support |

### Backend

| Technology | Version | Reason |
|---|---|---|
| Hono | v4 | <!-- TODO: 選定理由 --> |
| Drizzle ORM | latest | Type-safe SQL queries |
| Better Auth | latest | Authentication with OAuth and 2FA support |
| Zod | v4 | Runtime validation and OpenAPI generation |
| PostgreSQL | 17 | <!-- TODO: 選定理由 --> |

### Infrastructure

| Technology | Reason |
|---|---|
| Docker / Docker Compose | Single-command deployment |
| pnpm workspace | Monorepo management |
| Cloudflare Tunnel | <!-- TODO: デプロイ環境の説明 --> |

---

## Database Schema

<!-- TODO: ER図を挿入してもいいかも -->

### Tables

**user** — Stores user accounts and roles (managed by Better Auth + custom `role` field)

| Column | Type | Description |
|---|---|---|
| id | text (PK) | |
| name | text | Display name |
| email | text (unique) | |
| role | text | `admin` or `user` |
| emailVerified | boolean | |
| image | text, nullable | Avatar URL |
| createdAt | timestamp | |
| updatedAt | timestamp | |

**session** — Active user sessions (managed by Better Auth)

**account** — OAuth provider links and password hashes (managed by Better Auth)

**verification** — Email verification tokens (managed by Better Auth)

**task** — Core task data

| Column | Type | Description |
|---|---|---|
| id | text (PK) | |
| title | text | 1–200 characters |
| description | text, nullable | Up to 2000 characters |
| status | text | `todo` / `in_progress` / `done` |
| priority | text, nullable | `low` / `medium` / `high` |
| dueDate | timestamp, nullable | |
| createdBy | text (FK → user.id) | |
| createdAt | timestamp | |
| updatedAt | timestamp | |

**task_assignment** — Many-to-many: tasks ↔ users

| Column | Type | Description |
|---|---|---|
| id | text (PK) | |
| taskId | text (FK → task.id) | |
| userId | text (FK → user.id) | |
| assignedAt | timestamp | |

**notification** — In-app notifications triggered by task events

| Column | Type | Description |
|---|---|---|
| id | text (PK) | |
| userId | text (FK → user.id) | Recipient |
| taskId | text (FK → task.id) | |
| type | text | `created` / `updated` / `deleted` |
| isRead | boolean | Default: false |
| createdAt | timestamp | |

---

## Features

<!-- TODO: 実装が進んだら担当者欄を埋める -->

| Feature | Description | Implemented by |
|---|---|---|
| Email + Password auth | Sign up and log in securely with hashed passwords | <!-- TODO --> |
| GitHub OAuth | Log in with GitHub account | <!-- TODO --> |
| User profile | View and edit profile, upload avatar | <!-- TODO --> |
| Task CRUD | Create, view, edit, delete tasks | <!-- TODO --> |
| Task assignment | Assign tasks to multiple users | <!-- TODO --> |
| Role-based access | Admin can manage all users and tasks | <!-- TODO --> |
| Real-time updates | Task changes reflected instantly via WebSocket | <!-- TODO --> |
| Public API | REST API with API key auth and Swagger docs | <!-- TODO --> |
| Notifications | In-app notifications on task events | <!-- TODO --> |
| Multi-language | Switch between Japanese, English, <!-- TODO --> | <!-- TODO --> |
| Health check | `/health` endpoint for monitoring | <!-- TODO --> |
| Privacy Policy | Accessible from footer | <!-- TODO --> |
| Terms of Service | Accessible from footer | <!-- TODO --> |

---

## Modules

Total claimed points: **14**

| Module | Category | Type | Points | Implemented by |
|---|---|---|---|---|
| Use a framework for both frontend and backend (React + Hono) | Web | Major | 2 | <!-- TODO --> |
| Real-time features (WebSocket) | Web | Major | 2 | <!-- TODO --> |
| Public API (5+ endpoints, API key, rate limiting, Swagger) | Web | Major | 2 | <!-- TODO --> |
| ORM (Drizzle ORM) | Web | Minor | 1 | <!-- TODO --> |
| Standard user management (profile, avatar, online status) | User Management | Major | 2 | <!-- TODO --> |
| Advanced permissions system (admin / user roles) | User Management | Major | 2 | <!-- TODO --> |
| OAuth 2.0 (GitHub) | User Management | Minor | 1 | <!-- TODO --> |
| Multiple languages (3 languages, i18n) | Accessibility | Minor | 1 | <!-- TODO --> |
| Health check and backup procedures | Devops | Minor | 1 | <!-- TODO --> |

### Module Justifications

**Real-time features (WebSocket)**
When a task is created, updated, or deleted, all connected users see the change immediately without refreshing. This is implemented using Hono's WebSocket support (`@hono/node-ws`) with room-based broadcasting scoped to all authenticated users.

**Public API**
<!-- TODO: 実装後に具体的なエンドポイントを記載 -->
Provides a secured REST API for external access to task data. Endpoints are documented via Swagger UI at `/api/docs`. Rate limiting is applied per API key using `hono-rate-limiter`.

**Advanced permissions system**
<!-- TODO: 実装後に具体的な権限の違いを記載 -->
Two roles are implemented: `admin` (can manage all users and tasks) and `user` (can only manage their own tasks). Access control is enforced at both the API level (middleware) and the frontend (UI visibility).

---

## Individual Contributions

<!-- TODO: 実装完了後に各メンバーが自分で記載する -->

### <!-- login1 --> (Product Owner)
- ...

### <!-- login2 --> (Project Manager)
- ...

### <!-- login3 --> (Tech Lead)
- ...

### <!-- login4 --> (Developer)
- ...

---

## Resources

### Documentation

- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [react-i18next](https://react.i18next.com/)
- [Zod](https://zod.dev/)
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

### AI Usage

AI tools were used in this project for the following purposes:

| Task | How AI was used |
|---|---|
| Code review | Reviewing Zod schema definitions and <!-- TODO: 実装後に追記 --> |
| Documentation | Drafting Privacy Policy and Terms of Service pages |

All AI-generated content was reviewed, tested, and understood by the team members before being included in the project. No code was copied without understanding its behavior.

---

## License

This project was created for educational purposes as part of the 42 curriculum.
