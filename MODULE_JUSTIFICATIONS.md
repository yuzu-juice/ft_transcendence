# Module Selection Justifications (English Version)

Total declared points: **20 points** (14 mandatory + 6 bonus)

---

## Web

### Use a framework for both the frontend and backend — Major, 2pt

We adopted existing frameworks as the foundation of the web application, so that the mechanisms commonly required by a web application would not need to be rebuilt from scratch, allowing us to focus on feature development. For many features, we leveraged libraries built for these frameworks to improve developer experience and development speed.

**Implementation:** The frontend uses React 19, with the screen state organized into components. The backend uses Hono, structuring a Web API centered around HTTP request routing.

**Owner:** genomoto

---

### Public API — Major, 2pt

We made it possible to read and write task data from external clients (scripts, external integrations) without going through the browser session. Rate limiting is set to 30 requests per minute (per API key).

**Implementation:** In `apps/backend/src/features/task/public.ts`, 5 endpoints are exposed with Bearer-style API key authentication.

- `GET /api/v1/tasks` — Paginated list
- `POST /api/v1/tasks` — Create new task
- `GET /api/v1/tasks/{taskId}` — Retrieve details
- `PATCH /api/v1/tasks/{taskId}` — Partial update
- `DELETE /api/v1/tasks/{taskId}` — Delete (only tasks created by the key owner themselves)

API keys are issued in the format `ft_<prefix>_<secret>`, hashed with SHA-256 before storage (`apps/backend/src/features/api-key/service.ts`). Only the identifying prefix portion is kept in plaintext. Requests are rate-limited to 30 requests per minute per API key (`hono-rate-limiter`). The specification can be viewed and tried out via the Swagger UI at `/api/v1/docs`.

**Owner:** ssoeno

---

### Use an ORM for the database (Drizzle ORM) — Minor, 1pt

We adopted a type-safe ORM so that database operations and schema definitions could be written in a type-safe manner using TypeScript, reducing implementation mistakes caused by SQL assembly errors or type mismatches.

**Implementation:** `drizzle-orm` is used for backend database access across tables such as tasks, users, API keys, and Better Auth–related tables. `drizzle-kit` is used to generate and run migrations, and migration files are committed under `apps/backend/drizzle/`.

**Owner:** genomoto

---

### Custom design system — Minor, 1pt

By maintaining a shared component library, we ensured visual consistency.

**Implementation:** `packages/otsukimi-ui` is an independent workspace package with its own Storybook, CI, and release pipeline. `src/foundations/tokens.css` defines design tokens including color palettes (background, brand, accent, text, etc.), spacing, corner radii, and typography for body and heading text (LINE Seed JP and Zen Maru Gothic). It also provides 11 reusable components — Button, Card, Input, Checkbox, RadioButton, Accordion, SearchBar, ListItem, Link, Divider, and Badge — along with 13 custom icons, satisfying the module's "minimum 10 components" requirement. The frontend consumes it as `otsukimi-ui: workspace:*`, and Storybook itself is deployed independently.

**Owner:** takitaga

---

### Advanced search functionality — Minor, 1pt

Since all users' tasks appear in a single shared list, we added the ability to filter and sort tasks managed within the application by their attributes.

**Implementation:** `searchTaskSchema` (`apps/backend/src/features/task/schema.ts`) backs `GET /tasks`, supporting free-text search (`q`), multi-value `status` and `priority` filters, due-date range filtering (`dueFrom`/`dueTo`), `createdBy`/`assigneeId` filters, sorting on 5 fields (`createdAt`, `updatedAt`, `dueAt`, `status`, `priority`) in ascending/descending order, and pagination.

**Owner:** genomoto

---

## Accessibility and Internationalization

### Support for multiple languages (at least 3 languages) — Minor, 1pt

To allow users to use the same task management features regardless of their language, we implemented multi-language support.

**Implementation:** Using `react-i18next`, we implemented complete translation sets for three languages — Japanese, English, and Chinese (`apps/frontend/src/lib/i18n/locales/{ja,en,zh}/common.json`) — along with a language switcher in the UI. All major user-facing strings go through the translation layer.

**Owner:** ssoeno, genomoto

---

### Support for additional browsers — Minor, 1pt

To ensure users can use the application reliably regardless of the browser they use, we verified compatibility with major browsers.

We performed manual testing on Edge, Brave, and Chromium in addition to Chrome, checking major flows such as authentication, task CRUD, the admin panel, and the analytics dashboard. No browser-specific layout breakage or functional issues requiring special handling were found.

**Owner:** genomoto

---

## User Management

### Implement remote authentication with OAuth 2.0 — Minor, 1pt

While this project requires email/password authentication, we added a mechanism to allow secure login via a GitHub account as well.

**Implementation:** Using Better Auth's `socialProviders` configuration (`apps/backend/src/auth/index.ts`), we implemented authentication and login via GitHub accounts. A dedicated sign-in button (`GitHubSignIn.tsx`) is provided on the frontend. Better Auth handles the OAuth exchange, and the resulting identity is linked to the `user`/`account` tables in this application's database.

**Owner:** genomoto

---

### Implement a complete 2FA (Two-Factor Authentication) system for the users — Minor, 1pt

We implemented this as a standard measure to raise the barrier against account takeover.

**Implementation:** We configured Better Auth's `twoFactor` plugin (TOTP method) with the issuer name `LunaPhase`. Users can generate one-time passwords via Google Authenticator and use them for identity verification at login. The `two_factor` table holds the secret, verification status, and fields for brute-force protection lockout (`failedVerificationCount`, `lockedUntil`). On the frontend, we provide QR-code-based enrollment (`TotpSetup.tsx`, using `react-qr-code`), a login-time challenge screen (`TotpChallenge.tsx`), and a code entry form (`TotpCodeForm.tsx`).

**Owner:** genomoto

---

### Advanced permissions system — Major, 2pt

We implemented consistent permission checks across both the frontend and backend, providing admin-only features (user management, and the ability to delete tasks created by other users).

**Implementation:** Using Better Auth's `admin` plugin, we implemented two roles: `admin` and `user`. Admins can view the user list and details, edit profiles, delete accounts, and change users' roles. A dedicated admin user-management screen provides different views and operations from those available to regular users (`apps/frontend/src/features/admin/api.ts`). On the backend, the `requireAdmin` middleware (`apps/backend/src/middleware/auth.ts`) restricts access to admin-only endpoints to admins only.

**Owner:** genomoto

---

## Devops

### Infrastructure for log management using ELK (Elasticsearch, Logstash, Kibana) — Major, 2pt

In a setup where multiple services run in containers, `docker logs` alone lacks the scalability needed for investigation and pattern recognition, so we set up a searchable, aggregated log store.

**Implementation:** The backend outputs structured logs in Elastic Common Schema (ECS) format using `pino` and `@elastic/ecs-pino-format` (`apps/backend/src/logger/index.ts`). Docker's GELF logging driver forwards the backend container's logs to Logstash; Logstash receives them via its GELF input, parses the JSON and transforms fields, and outputs to Elasticsearch through a pipeline (`infra/logstash/logstash.conf`). Elasticsearch and Kibana also run as dedicated services in `compose.yml`, with Kibana exposed for log viewing via a reverse proxy. Log data retrieved by Elasticsearch is retained for 7 days before deletion. Daily data snapshots are also taken and retained for 30 days before deletion.

**Owner:** takitaga

---

### Monitoring system with Prometheus and Grafana — Major, 2pt

Beyond logs, we visualized resource usage and service health (CPU/memory, container statistics) so that issues can be noticed before they become failures. This also serves as concrete material to demonstrate system health to evaluators.

**Implementation:** Prometheus (`infra/prometheus/prometheus.yml`) scrapes `node-exporter` (host metrics) and `cadvisor` (per-container metrics). Grafana is configured with custom dashboards (`infra/grafana/dashboards/{cadvisor,node-exporter,custom}.json`) and alert rules connected to a Discord webhook contact point (`infra/grafana/provisioning/alerting/`).

**Owner:** genomoto

---

## Data and Analytics

### Advanced analytics dashboard with data visualization — Major, 2pt

We implemented a summary view that aggregates task status, priority, and other attributes so the overall situation can be grasped at a glance.

**Implementation:** `GET /analytics/summary` (`apps/backend/src/features/task/analytics.routes.ts`) aggregates total task count, completion rate, overdue count, and breakdowns by status and priority, with filtering by due-date range. The frontend (`apps/frontend/src/features/analytics/components/AnalyticsPage.tsx`) displays this as summary cards and percentage bars, and also supports CSV export via `react-csv`. We also implemented real-time updates every 30 seconds via polling, along with interactive pie charts using Tanstack Charts.

**Owner:** ssoeno, genomoto

---

## Cybersecurity

### WAF/ModSecurity + HashiCorp Vault — Cybersecurity, Major

This module is not being claimed for points.

ModSecurity, incorporating the OWASP Core Rule Set, is actually running on the reverse proxy (using the `owasp/modsecurity-crs` base image, configured in `infra/nginx/nginx.conf`), in detection/blocking mode with tuned rule exclusions. However, this module requires both a "hardened WAF" and "HashiCorp Vault for secrets management," and Vault is not implemented (secrets are currently managed via `.env` files; no dedicated secrets management tool has been introduced).

**Owner:** tamatsuu

---

## Custom Module (WebMCP) — Minor, 1 point

We introduced WebMCP, which exposes the web application's functionality to AI agents as structured tools, providing an interface separate from the human-facing UI that lets AI agents directly use the application's features.

**Technical challenge addressed:** Typical browser-operating AI agents must operate an application through a UI designed for humans — parsing the DOM or on-screen elements and interacting via button clicks, form input, and so on. This approach requires parsing the screen structure, makes operations fragile against UI changes, and forces the AI to infer the target operations and input values on its own. WebMCP allows an application's functionality to be exposed as a structured interface with a tool name, description, and input schema. This lets an AI agent invoke functionality explicitly defined by the application, instead of having to interpret the DOM or screen structure to infer how to operate it. As a result, it improves the efficiency and predictability of AI agent operations while reducing dependence on UI structure.

**How it adds value to the project:** By providing an operation interface for AI agents in addition to the regular web UI, the same task management functionality becomes usable not only by humans but also by WebMCP-compatible AI agents. Without the user manually operating the screen, an AI agent can search, create, edit tasks, and assign owners on the user's behalf. This extends the application's usage to include operation via AI agents.

**Why it deserves module status:** In this implementation, we selected which operations to expose to AI agents and organized the responsibilities and input fields of each tool. We also combined it with the application's existing implementation so that it would not conflict with the human-facing UI. We succeeded in accepting AI agents safely without adding complexity to the codebase.

**Implementation:** As WebMCP tools, we expose the logged-in user's information as well as task search, detail retrieval, creation, editing, and assignee-assignment functionality. Each tool has a defined description of its behavior and an input schema.
