*This project has been created as part of the 42 curriculum by takitaga, ssoeno, genomoto, <!-- login_name -->.*

---

## Description

**Key Features:**

- Task management with real-time updates
- Role-based access control (admin / user)
- Public API with Swagger documentation
- Multi-language support (Japanese, English, Chinese)
- OAuth login (GitHub)
- Progressive Web App support
- <!-- TODO: 実装完了後、具体的な内容を追加 -->

---

## Team

| Login | Role | Responsibilities |
|---|---|---|
| takitaga | Product Owner + Developer | <!-- TODO: 担当内容 --> |
| ssoeno | Project Manager + Developer | Public API implementation |
| genomoto | Technical Lead + Developer | <!-- TODO: 担当内容 --> |
| <!-- login_name --> | Developer | <!-- TODO: 担当内容 --> |

---

## Project Management

**Task organization:** We used [GitHub Projects](https://github.com/users/yuzu-juice/projects/3/views/2) to manage tasks, track progress, and distribute work among team members.

**Meeting cadence:** <!-- TODO: 例）Weekly sync on Discord every Sunday -->

**Communication:** 
Discord for daily communication

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

---

## Technical Stack

### Frontend

| Technology | Version | Reason |
|---|---|---|
| React | 19 | Component-based UI; treated as a framework in this project due to its ecosystem and architectural patterns |
| Vite | latest | Fast build tool for modern frontend development |
| Tailwind CSS | v4 | Utility-first CSS framework for rapid UI development |
| TanStack Router | v1 | Type-safe file-based routing with built-in devtools and performance optimization |
| TanStack Query | v5 | Simplifies data fetching and caching; prevents unnecessary re-fetches compared to plain useEffect/useState |
| TanStack Form | latest | Form implementation with type-safe validation |
| react-i18next | latest | React integration of i18next for multi-language support |

### Backend

| Technology | Version | Reason |
|---|---|---|
| Hono | v4 | Lightweight TypeScript-first web framework built on Web Standards |
| Drizzle ORM | latest | TypeScript-first ORM with SQL-like query syntax; first example in official docs uses PostgreSQL |
| Better Auth | latest | Supports Email+Password, OAuth, and 2FA (TOTP); integrates with Hono and Drizzle |
| Zod | v4 | Runtime validation and automatic OpenAPI spec generation via @hono/zod-openapi |
| PostgreSQL | 17 | Relational DB; used as the base for Better Auth schema design |

### Infrastructure

| Technology | Reason |
|---|---|
| Docker / Docker Compose | Single-command deployment as required by the subject |
| pnpm workspace | Monorepo management; built-in support reduces tooling overhead |
| Node.js | 24 LTS runtime for the backend |
| Cloudflare Tunnel + Cloudflare Access | Exposes the local server for peer review without making it publicly accessible |

---

## Database Schema

<!-- TODO: 実装後にER図をいれてもいいかも -->

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
| Multi-language | Switch between Japanese, English, and Chinese | <!-- TODO --> |
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

### takitaga (Product Owner)
- <!-- TODO: 実装完了後に記載 -->

### ssoeno (Project Manager)
- <!-- TODO: 実装完了後に記載 -->

### genomoto (Technical Lead)
- <!-- TODO: 実装完了後に記載 -->

### <!-- login_name --> (Developer)
- <!-- TODO: 実装完了後に記載 -->

---

## Resources

### Documentation

- [Hono](https://hono.dev/)
- [Hono Integration | Better Auth](https://better-auth.com/docs/integrations/hono)
- [Drizzle ORM Adapter | Better Auth](https://better-auth.com/docs/adapters/drizzle)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Form](https://tanstack.com/form/latest)
- [react-i18next](https://react.i18next.com/)
- [Zod](https://zod.dev/)
- [Zod OpenAPI - Hono](https://hono.dev/examples/zod-openapi)
- [swagger-ui middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)
- [hono-rate-limiter](https://github.com/rhinobase/hono-rate-limiter)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

### Articles

- [React入門 2026 - モダンなReact開発を基礎から学ぶ](https://zenn.dev/rasshii/books/learning-react-2026)
- [React Router v6 から Tanstack Router v1に移行して感じたメリット](https://zenn.dev/genda_jp/articles/52977482fba7fa)
- [TanStack Routerでサクッと始める型安全ルーティング](https://zenn.dev/calloc134/articles/6680b272a2c2c5)
- [【パスキー・2FA・OAuth】Better Authで作るモダン認証システム](https://zenn.dev/sc30gsw/articles/0484624ecd07b8)

### AI Usage

AI tools (Claude) were used in this project for the following purposes:

| Task | How AI was used |
|---|---|
| Code review | Reviewing Zod schema definitions and <!-- TODO: 実装が進んだら具体的に記載する。 --> |
| Documentation | Drafting Privacy Policy and Terms of Service pages |

All AI-generated content was reviewed, tested, and understood by the team members before being included in the project. No code was copied without understanding its behavior.

---

## License

This project was created for educational purposes as part of the 42 curriculum.