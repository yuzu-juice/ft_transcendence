# Backend 開発ガイド

本ドキュメントは、`apps/backend` に API、DB テーブル、middleware などを追加する開発者向けのガイドです。
backend は Hono、Drizzle ORM、Better Auth、PostgreSQL で構成されています。

## 1. 全体像

### 実行時のパス

開発環境では `http://localhost:8080` の Nginx が frontend と backend のリバースプロキシになります。Nginx の `location /api/` は `/api` を取り除いて backend に転送します。

| 外部から見える URL       | backend が受け取るパス | 用途                                                 | 認証               |
| ------------------------ | ---------------------- | ---------------------------------------------------- | ------------------ |
| `/api/auth/*`            | `/auth/*`              | Better Auth のサインアップ、ログイン、セッションなど | Better Auth が処理 |
| `/api/internal/*`        | `/internal/*`          | 現在の frontend 向け internal API                    | `requireAuth` 必須 |
| `/api/avatar/:avatarKey` | `/avatar/:avatarKey`   | WebP avatar の配信                                   | 公開               |

Hono の route には `/api` を記述しません。例えば `internal.route('/tasks', tasks)` に追加した `tasks.get('/')` は、外部からは `GET /api/internal/tasks` になります。

### エントリポイント

- `src/index.ts`: Hono アプリの生成、error/not-found handler、route mount、Node server の起動。
- `src/routes/internal.ts`: internal API の共通認証と feature route の mount。
- `src/routes/avatar.ts`: 公開 avatar 配信 route。
- `src/auth/index.ts`: Better Auth と Drizzle adapter の設定。
- `src/db/index.ts`: PostgreSQL の pool と Drizzle client の生成。

### ディレクトリ構成

```text
apps/backend/
├─ src/
│  ├─ auth/                 Better Auth の設定
│  ├─ db/
│  │  ├─ schema/            Drizzle のテーブル定義
│  │  ├─ relations.ts       Drizzle relational query 用の relation 定義
│  │  └─ index.ts           Pool と db client
│  ├─ errors/               アプリケーションエラー
│  ├─ middleware/           認証、認可、validation、error handler
│  ├─ routes/               大きな route group の mount と公開 route
│  └─ features/
│     ├─ user/              user の schema/repository/service/routes
│     ├─ task/              task の schema/repository/service/routes
│     ├─ admin/             admin user の schema/repository/service/routes
│     └─ avatar/            avatar の schema/service/file storage
├─ scripts/                 bootstrap-admin、開発用 seed
├─ drizzle/                 生成済み SQL migration
└─ docs/openapi-internal.yaml
```

`dist/` は TypeScript の build output です。直接編集せず、常に `src/` を変更してください。

## 2. レイヤーと責務

既存 feature は概ね次の流れです。

```text
Hono route
  ├─ request の validation / c.req.valid()
  ├─ c.get('user') などの認証情報取得
  ▼
Service
  ├─ business rule、権限、存在チェック
  ├─ AppError への変換
  ▼
Repository
  └─ Drizzle の SQL / relational query
  ▼
PostgreSQL
```

### Route

HTTP の関心事だけを担当します。

- HTTP method、path、status code を定義する。
- `validate('json' | 'query' | 'param', schema)` で入力を検証する。
- 認証済み user は `c.get('user')!` から取得する。
- DB を直接呼ばず、service を呼び出す。
- 成功時の response の形を決める。

### Schema

Zod schema を `features/<feature>/schema.ts` に置きます。`z.infer` で入力型も同じ場所から生成します。DB の enum を API でも使う場合は、task feature のように `taskStatusEnum.enumValues` から `z.enum` を作ると、DB と API の値の二重管理を避けられます。

### Service

DB の取得・更新だけでなく、次のような business rule を置きます。

- entity が存在しないときの `404`
- owner / admin などの権限判定
- 複数 repository 呼び出しの組み合わせ
- Better Auth API や file storage と DB 更新の調整

Service は `AppError` を throw してください。

### Repository

Drizzle の query を repository に閉じ込めます。Service や route から `db` を直接参照しないでください。

- 必要な列だけを `columns` / `select({ ... })` で選ぶ。
- relation が必要なときは `with` を使う。
- 検索条件、sort、pagination の組み立てを repository に置く。
- 値を明示的に空にすることができる場合は `null`, そのフィールド自体を使用しなくても良い場合は `undefined` を採用する。

## 3. Hono の使い方

### Route の追加

```ts
// src/features/project/internal.ts
import { Hono } from "hono";
import type { AuthEnv } from "../../middleware/auth.js";
import { validate } from "../../middleware/validator.js";
import { createProjectSchema } from "./schema.js";
import { projectService } from "./service.js";

export const projects = new Hono<AuthEnv>();

projects.post("/", validate("json", createProjectSchema), async (c) => {
  const { id: userId } = c.get("user")!;
  const input = c.req.valid("json");

  const project = await projectService.create(userId, input);
  return c.json(project, 201);
});
```

route group に mount します。

```ts
// src/routes/internal.ts
import { projects } from "../features/project/internal.js";

internal.route("/projects", projects);
```

この group 全体にはすでに `internal.use(requireAuth)` が設定されているため、internal API では route ごとに `requireAuth` を重ねて書きません。

### 認証・認可

`src/middleware/auth.ts` には次の middleware があります。

- `requireAuth`: Better Auth の `auth.api.getSession()` を request header の Cookie で呼び出し、`session` と `user` を Hono context に設定する。未ログインなら `AUTH_REQUIRED` / `401`。
- `requireAdmin`: context の `user.role` が `admin` であることを確認する。`ADMIN_REQUIRED` / `403`。

`requireAdmin` は `requireAuth` の後で使う前提です。admin route group のように、認証済みの group に対して追加してください。

```ts
const admin = new Hono<AuthEnv>();
admin.use(requireAdmin);
```

admin middleware を standalone route に付ける場合は、必ず `requireAuth` を先に付けてください。Better Auth の `role` は user テーブルの値で、現在の有効な admin role は `admin` です。

### Validation

`validate()` は `@hono/zod-validator` の薄い wrapper です。失敗時は `VALIDATION_ERROR` / `400` として、`details.fieldErrors` と `details.formErrors` を返します。

```ts
projects.get("/", validate("query", searchProjectSchema), async (c) => {
  const input = c.req.valid("query");
  return c.json(await projectService.search(input));
});
```

外部から文字列で渡される query / param は、UUID、数値、日付、enum、配列などを必ず schema で検証してください。query の同じキーが複数回指定される場合の扱いは、task の `queryArray()` の実装を参考にします。

### Error response

`AppError` と `onError` により、エラーは次の形式に統一されます。

```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task not found",
    "details": {}
  }
}
```

既知の業務エラーは次のように throw します。

```ts
throw new AppError("PROJECT_NOT_FOUND", 404, "Project not found");
```

未知の例外は `INTERNAL_SERVER_ERROR` / `500` に変換されます。内部の stack trace や DB エラーを response にそのまま返さないでください。意図的に route で直接 response を返す場合（multipart の missing field、avatar の `413` など）も、同じ `error.code` / `error.message` 形式に揃えます。

### Middleware の追加

全 route に必要な middleware は `src/index.ts`、特定 group に必要な middleware は group module の `use()` に追加します。認証情報を context に追加する middleware は `AuthEnv` の `Variables` に型を追加し、`new Hono<AuthEnv>()` を使って型を伝播させてください。

middleware の順番には注意が必要です。

1. body limit / request の共通制約
2. `requireAuth`
3. `requireAdmin` などの認可
4. route ごとの validation
5. handler

`c.req.raw` を Better Auth に渡す場合や、proxy header を利用する場合は、既存 middleware の実装を変更する前に Nginx の `X-Forwarded-*` 設定も確認してください。

## 4. Drizzle ORM と DB

### DB client

`src/db/index.ts` は `pg.Pool` を作り、`drizzle({ client: pool, relations })` で `db` を export しています。pool の設定は最大 10 接続、idle timeout 30 秒、connection timeout 5 秒です。通常の feature 実装では新しい Pool を作らず、既存の `db` を import してください。

### Schema の追加・変更

アプリケーションのテーブルは `src/db/schema/<name>.ts` に定義します。追加した schema は必ず `src/db/schema/index.ts` から export してください。Drizzle Kit はこの index を起点に全 schema を読み込みます。

```ts
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const project = pgTable(
  "project",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
  },
  (table) => [index("project_name_index").on(table.name)],
);
```

外部キーを追加するときは、参照先と削除時の挙動を明示します。

```ts
ownerId: text("owner_id").references(() => user.id, { onDelete: "cascade" });
```

現在使っている Drizzle の機能は、`pgTable`、`pgEnum`、`references`、index、composite primary key、`$onUpdate`、relations、relational query、`returning()`、`$count`、transaction です。task の `taskAssignment` は `(taskId, userId)` の composite primary key を持つ中間テーブルです。

### Relations

新しい relation を追加した場合は、`src/db/relations.ts` も更新します。relations は DB の foreign key そのものを作るものではなく、`db.query.<table>.findMany({ with: ... })` で関連データを取得するための定義です。foreign key は schema 側の `.references()` で別途定義してください。

例:

```ts
const projects = await db.query.project.findMany({
  columns: { id: true, name: true },
  with: {
    owner: {
      columns: { id: true, name: true },
    },
  },
});
```

relation を取得する必要がない list API では、`columns` で返却列を絞って N+1 query と過剰なデータ取得を避けてください。

### Migration の手順

1. schema file を追加・変更する。
2. `src/db/schema/index.ts` から export する。
3. relation を追加・変更する（必要な場合）。
4. migration を生成する。
5. 生成された SQL を確認する。
6. migration を Git に含める。

```sh
pnpm --filter backend db:generate
```

`drizzle.config.ts` は `src/db/schema/index.ts` と PostgreSQL dialect を使用します。生成された `apps/backend/drizzle/<timestamp>_<name>/migration.sql` と snapshot は削除・編集せず、意図した差分か確認して commit してください。Docker Compose 起動時は backend container の先頭で `db:migrate` が実行されるため、通常の開発では migration を手動適用する必要はありません。

なお、`db:generate` は schema から migration を作るだけですが、`db:check` と `db:migrate` は DB に接続します。ホストから実行する場合は `DATABASE_URL` がホストから解決できる値になっている必要があります。開発環境の `database` hostname を使う場合は、backend container 内、または `docker compose run --rm backend ...` から実行するのが安全です。

### Query の書き方

単純な query は query builder を使います。

```ts
const rows = await db
  .select({ id: project.id, name: project.name })
  .from(project)
  .where(eq(project.id, id));
```

検索条件が組み立て式の場合は、task repository のように `and`、`or`、`eq`、`inArray`、`gte`、`lte`、`ilike`、`exists` を使って `SQL` 条件を作ります。値を文字列連結した SQL を作らず、Drizzle の expression または parameterized `sql` を使用してください。

更新・作成した entity を返す場合は `returning()` を使えます。

```ts
const [row] = await db.insert(project).values(input).returning();
```

複数テーブルを一貫して更新する場合は transaction を使います。task の担当者更新は、既存の中間テーブルを削除してから新しい担当者を insert する処理全体を `db.transaction()` で囲んでいます。

## 5. Better Auth

Better Auth は `/auth` を base path とし、Drizzle adapter で次の generated schema を利用しています。

- `user`
- `session`
- `account`
- `verification`

`src/db/schema/auth.ts` には `/* This file is generated by Better Auth */` とあるため、認証機能の変更で必要な列やテーブルがある場合は Better Auth の schema generation / migration 手順を確認し、generated file を手作業で壊さないでください。アプリケーション固有の列・テーブルは別 schema file に置きます。

現在は email/password authentication と `admin` plugin を有効にしています。ユーザー登録やログインを独自に再実装せず、Better Auth の API を使ってください。admin service が role 変更時に対象 user の session を revoke している点も、認証状態に関係する変更を追加するときの参考にしてください。

HTTPie で確認する例です。

```sh
# ログインは POST。Cookie を session file に保存する
httpie --session=alice POST :8080/api/auth/sign-in/email \
  email=alice@example.test password=password123 \
  Origin:http://localhost:8080

# 保存した Cookie で internal API を呼ぶ
httpie --session=alice GET :8080/api/internal/me
```

Better Auth の security 設定により、開発環境でも `Origin:http://localhost:8080` が必要になることがあります。

## 6. Avatar storage の注意点

avatar は DB に画像バイナリを保存せず、`AVATAR_DIR` に UUID 名の `.webp` として保存します。user.image には `/api/avatar/<UUID>` の URL が入ります。

- 入力形式は JPEG、PNG、WebP。
- 1 ファイルの上限は 4 MiB。
- multipart body の上限は 5 MiB。
- `sharp` で EXIF orientation を反映し、256x256 に cover resize、WebP quality 80 へ変換。
- 入力画像の最大 pixel 数は `4096 * 4096`。
- 取得時は `Cache-Control: public, max-age=31536000, immutable` を返すため、同じ key のファイルを上書きしない。
- 更新に失敗した場合は新しいファイルを削除し、旧 avatar の削除失敗はログに記録して response 自体は成功させる設計。

新しい画像・ファイル機能を追加するときは、入力サイズ、Content-Type、ファイル名の path traversal、DB とファイルの片方だけ更新されるケースを検討してください。

## 7. 開発コマンド

コマンドは原則リポジトリルートから実行します。

### 開発環境

`.env.example` を `.env` にコピーして値を設定してから起動します。`DATABASE_URL` の hostname `database` は Compose network 内で解決されます。

```sh
pnpm install
docker compose up --watch
docker compose logs -f backend
docker compose down
```

backend container の起動時には次の順で実行されます。

1. `db:migrate`
2. `db:bootstrap-admin`
3. `db:seed:dev`
4. `dev`

初回だけでなく container 再起動時にも script は呼ばれますが、admin と開発 seed は存在チェックにより通常は skip されます。

### backend package の scripts

```sh
pnpm --filter backend dev
pnpm --filter backend build
pnpm --filter backend start

pnpm --filter backend db:generate
pnpm --filter backend db:migrate
pnpm --filter backend db:check

pnpm --filter backend db:bootstrap-admin
pnpm --filter backend db:seed:dev
```

`dev` / `build` / `start` は、それぞれ `src` の watch、`dist` への TypeScript build、build 済み JavaScript の起動です。`scripts/` は `tsconfig.json` の `rootDir` / `include` の対象外なので、seed script は `tsx` で実行します。

### package / formatter

```sh
pnpm --filter backend add <package>
pnpm --filter backend add -D <package>
pnpm check
pnpm check:write
pnpm lint
pnpm format
```

依存関係を追加・更新したら `pnpm-lock.yaml` を更新し、Docker image を再 build してください。Compose の watch は `package.json` や lockfile の変更時に rebuild する設定です。

## 8. 開発 seed と DB リセット

`scripts/bootstrap-admin.ts` は `INITIAL_ADMIN_EMAIL` / `INITIAL_ADMIN_PASSWORD` から admin を一人作ります。既存 admin があれば skip し、指定 email が既存の一般 user だった場合は error になります。

`scripts/seed-dev.ts` は production では実行できません。`dev-user-1@example.test` が存在する場合は全 seed を skip し、存在しない場合に Alice、Bob、Carol、avatar、task、task assignment を作成します。

ローカル DB を完全に作り直す場合は、次の操作で PostgreSQL volume を削除します。DB 内の全データが失われる破壊的操作なので、共有環境や必要なデータがある環境では実行しないでください。

```sh
docker volume rm ft_transcendence_postgres-data
```

avatar は別の `avatar-data` volume に保存されます。DB だけを消すと古い avatar file が残る可能性があるため、DB を完全に初期化する際は avatar volume と user.image の整合性も確認してください。

## 9. API 仕様と確認方法

internal API の仕様は `apps/backend/docs/openapi-internal.yaml` にあります。endpoint の追加、request / response、status code、error code、認証要件を変更したら、この OpenAPI も更新してください。仕様書の server からは `/api` が見える一方、Hono の実装は `/api` なしである点に注意してください。

Public API の Swagger UI は `http://localhost:8080/api/v1/docs` で確認できます（OpenAPI JSON は `http://localhost:8080/api/v1/docs/openapi`）。

Swagger Editor などで OpenAPI を開くと、認証済み API の request / response を確認できます。実装確認では HTTPie を推奨します。

```sh
# query parameter は key==value
httpie --session=alice GET :8080/api/internal/tasks \
  status==todo status==in_progress page==1

# JSON body は key=value、配列は key:=[...]
httpie --session=alice POST :8080/api/internal/tasks \
  title='New task' priority=high

# multipart は --form と field@path
httpie --form --session=alice PUT :8080/api/internal/me/avatar \
  avatar@./avatar.png
```
