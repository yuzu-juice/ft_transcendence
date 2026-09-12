

## 2. Database schema

Reasonably close to reality but incomplete.

- `api_key` table is undocumented — it exists (`id, name, keyHash, keyPrefix,
  userId, lastUsedAt, ...`) and is core to the Public API module, but isn't in the
  README's schema section at all.
- `two_factor` table is undocumented — exists with `secret, backupCodes, verified,
  failedVerificationCount, lockedUntil`, backs the 2FA module, but isn't described.
- `task` table: actual PK is `uuid`, not `text` as documented; `createdBy` is
  `ON DELETE SET NULL`, not stated.
- `task_assignment`: actual PK is a composite `(taskId, userId)`, not a separate
  `id` column as the README shows — there is no dedicated `id` column at all.
- No mention of the 6 Drizzle migrations already generated
  (`apps/backend/drizzle/2026...`).

## 3. Tech stack (with justification)
- Frontend deps in actual use but missing from the table: `sonner` (toasts),
  `react-csv` (CSV export), `react-qr-code` (2FA QR enrollment), `boring-avatars`,
  `react-markdown` + `remark-gfm` (legal pages).
- Backend deps missing: `@elastic/ecs-pino-format` + `pino` (structured logging
  feeding ELK), `sharp` (avatar image processing).
- `vite-plugin-pwa` is listed under "Resources → Documentation" but isn't a
  dependency and isn't used anywhere in the frontend — dead reference, should be
  removed.
- Versions are drifting: README says React 19 / Vite latest / Zod v4 generically;
  actual pinned versions (React 19.2.8, Vite 8.2.0, Zod 4.4.3, Better Auth
  1.7.0-rc.6, Drizzle 1.0.0-rc.4) aren't recorded. Worth flagging that **Better Auth
  and Drizzle ORM are both on release candidates**, since a reviewer may ask why.

## 4. Features list + who implemented them

- Feature tables exist and are mostly accurate against the route/feature code
  (auth, profile, tasks, analytics, API keys, admin), but none of them have an
  "implemented by" column — every feature is unattributed, unlike the Modules table
  which at least tries.
- Task feature table doesn't mention that task assignment is edit-only via a `PUT`
  assignees endpoint, or that search supports `dueFrom`/`dueTo` range filters plus
  multi-value `status`/`priority` — richer than the "filter by status, priority, due
  date" one-liner suggests.
- Grafana/Kibana access (documented in `DEVDOC.md` with URLs and credentials) has no
  corresponding entry in the README's Features section at all — monitoring/logging
  is invisible to a reader of just the README.



