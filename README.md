*This project has been created as part of the 42 curriculum by takitaga, ssoeno, genomoto, tamatsuu, and <login_name>.*

---

## Description

This project is a task management web app built with React and Hono. It combines authentication, permissions management, a public API, and a data visualization dashboard to help teams manage their tasks efficiently.

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
| Tailwind CSS | v4 | Utility-first CSS framework for rapid UI development, responsive UI development |
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

**task_assignment** — Many-to-many: tasks ↔ users  <!-- TODO: 1つのタスクにアサインできるユーザーは一人にしたほうがシンプルかも -->

| Column | Type | Description |
|---|---|---|
| id | text (PK) | |
| taskId | text (FK → task.id) | |
| userId | text (FK → user.id) | |
| assignedAt | timestamp | |

---

## Features

### Features Available to All Users

#### Authentication

| Feature | Description |
|---|---|
| Sign up / Log in with email and password | Passwords are stored with hashing and salting |
| Log in with GitHub (OAuth) | Retrieves GitHub username, email, and avatar |
| Two-Factor Authentication (2FA / TOTP) | One-time password via authenticator app (e.g. Google Authenticator) |
| Log out | Destroys session and redirects to login page |

#### Profile

| Feature | Description |
|---|---|
| View and edit profile | View and update display name and avatar image |
| Upload avatar image | Shows a default image if none is set |

#### Tasks

| Feature | Description |
|---|---|
| Create a task | Set title, description, priority, and due date |
| View task list | Browse all tasks created by any user |
| View task detail | See full task information and assignees |
| Edit / delete own tasks | Only tasks created by the user can be modified |
| Change task status | Three stages: todo → in_progress → done |
| Assign users to a task | Multiple users can be assigned to a single task |  <!-- TODO:要検討 -->
| Search, filter, sort, and paginate tasks | Filter by status, priority, due date; 20 items per page |

#### Data and Analytics

| Feature | Description |
|---|---|
| Data visualization dashboard | Interactive charts showing task progress, status distribution, and priority breakdown; supports date range filters |

#### API

| Feature | Description |
|---|---|
| Issue and manage API keys | Users can generate and revoke their own API keys |
| Get task list | `GET /api/tasks` — filterable by status and page number |
| Get task detail | `GET /api/tasks/:id` — returns task info and assignees |
| Create a task | `POST /api/tasks` — accepts title, description, priority, and due date |
| Update a task | `PUT /api/tasks/:id` — partial update (only sent fields are changed) |
| Delete a task | `DELETE /api/tasks/:id` — deletes the task and returns 204 |
| Rate limiting | Uses `hono-rate-limiter`; 60 requests per minute per API key <!-- TODO: rate limitは後日要検討 --> |
| API documentation | `GET /api/docs` — Swagger UI for browsing and testing endpoints in the browser |

#### UI and Accessibility

| Feature | Description |
|---|---|
| Language switcher | Switch between Japanese, English, and one additional language |
| Additional browser support | Verified to work on Firefox and Safari in addition to Chrome <!-- TODO:要確認 --> |
| View Privacy Policy and Terms of Service | Accessible via links in the footer |

### Features Available to Admins Only

#### User Management

| Feature | Description |
|---|---|
| View user management page | Full list of all users (hidden from regular users) |
| Edit / delete users | Update name and email, or delete accounts |
| Change user roles | Promote a user to admin, or demote an admin to user |

#### Task Management

| Feature | Description |
|---|---|
| Edit / delete any task | Admins can modify tasks created by other users |


---

## Modules

Total claimed points: <!-- TODO: 実装完了後に合計点数を記載 -->

| Module | Category | Type | Points | Implemented by |
|---|---|---|---|---|
| Use a framework for both frontend and backend (React + Hono) | Web | Major | 2 | <!-- TODO --> |
| Public API (5+ endpoints, API key, rate limiting, Swagger) | Web | Major | 2 | ssoeno |
| ORM (Drizzle ORM) | Web | Minor | 1 | <!-- TODO --> |
| Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components). | Web | Minor | 1 | takitaga |
| Implement advanced search functionality with filters, sorting, and pagination | Web | Minor | 1 | <!-- TODO --> |
| Support for multiple languages (at least 3 languages). | Accessibility and Internationalization | Minor | 1 | ssoeno |
| Support for additional browsers. | Accessiblity and Interationalization  | Minor | 1 | <!-- TODO --> | 
| Implement remote authentication with OAuth 2.0 | User Management | Minor | 1 | <!-- TODO --> | 
| Implement a complete 2FA (Two-Factor Authentication) system for the users | User Management | Minor | 1 | <!-- TODO --> | 
| Advanced permissions system | User Management | Major | 2 | <!-- TODO --> | 
| Implement WAF/ModSecurity (hardened) + HashiCorp Vault for secrets  | Cybersecurity | Major | 2 | <!-- TODO --> | 
| Infrastructure for log management using ELK (Elasticsearch, Logstash, Kibana). | Devops | Major | 2 | <!-- TODO --> |
| Monitoring system with Prometheus and Grafana. | Devops | Major | 2 | <!-- TODO --> | 
| Advanced analytics dashboard with data visualization. | Data and Analytics | Major | 2 | ssoeno |


### Module Justifications

<!-- TODO: 実装完了後に更新 -->

**Public API**
<!-- TODO: 実装後に具体的なエンドポイントを記載 -->
Provides a secured REST API for external access to task data. Endpoints are documented via Swagger UI at `/api/docs`. Rate limiting is applied per API key using `hono-rate-limiter`.

**Advanced permissions system**
<!-- TODO: 実装後に具体的な権限の違いを記載 -->
Two roles are implemented: `admin` (can manage all users and tasks) and `user` (can only manage their own tasks). Access control is enforced at both the API level (middleware) and the frontend (UI visibility).

---

## Individual Contributions

<!-- TODO: 実装完了後に各メンバーが自分で記載する -->

takitaga (Product Owner)
-  <!-- TODO: 実装完了後に記載 -->

ssoeno (Project Manager)
- <!-- TODO: 実装完了後に記載 -->

genomoto (Technical Lead)
- <!-- TODO: 実装完了後に記載 -->

<!-- login_name --> (Developer)
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
