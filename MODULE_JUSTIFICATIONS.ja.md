# モジュール選定理由（日本語版）

申告ポイント合計: **19点**（必須14点 + ボーナス5点）

---

## Web

### フロントエンド・バックエンド双方でフレームワークを使用 — Major, 2pt

フレームワークを使うことで、ルーティング・バリデーション・型付けといった基本的な設計判断を、チーム内で共通化した。

**実装内容:** フロントエンドは React 19（TanStack Router / Query / Form を併用）。バックエンドは Hono 4（TypeScriptファーストのWebフレームワーク）と、型付きルート定義のための `@hono/zod-openapi` を使用。どちらも単なる描画補助ではなく、ルーティング・ミドルウェア・状態管理・データ層まで含めて、フレームワークとしての役割を担っている。

**担当:** genomoto

---

### Public API — Major, 2pt

ブラウザのセッションを介さず、外部クライアント（スクリプトや外部連携）からタスクデータを読み書きできるようにした。レート制限は1分あたり30回（APIキー単位）。

**実装内容:** `apps/backend/src/features/task/public.ts` にて、Bearer形式のAPIキー認証つきで5つのエンドポイントを公開。

- `GET /api/tasks` — ページネーション付き一覧
- `POST /api/tasks` — 新規作成
- `GET /api/tasks/{taskId}` — 詳細取得
- `PATCH /api/tasks/{taskId}` — 部分更新
- `DELETE /api/tasks/{taskId}` — 削除（キー所有者自身が作成したタスクのみ）

APIキーは `ft_<prefix>_<secret>` の形式で発行し、SHA-256でハッシュ化して保存（`apps/backend/src/features/api-key/service.ts`）。平文で保持するのは識別用のprefix部分のみ。リクエストはAPIキー単位で1分間30リクエストにレート制限（`hono-rate-limiter`）。仕様は `/api/v1/docs` のSwagger UIから閲覧・実行できる。

**担当:** ssoeno

---

### ORM（Drizzle ORM）— Minor, 1pt

型安全なORMを使うことで、SQL文字列の手書き連結を避け、テーブル定義とTypeScriptの型を自動的に同期させた。

**実装内容:** タスク・ユーザー・APIキー・better-auth関連テーブルなど、バックエンドの全データアクセスで `drizzle-orm` と `drizzle-kit`（スキーマ定義・マイグレーション・クエリビルド）を使用。マイグレーションは `apps/backend/drizzle/` にコミット済み。

**担当:** genomoto

---

### カスタムデザインシステム — Minor, 1pt

共有のコンポーネントライブラリを持つことで、見た目の一貫性を保った。

**実装内容:** `packages/otsukimi-ui` は、独自のStorybook・CI・リリースパイプラインを持つ独立したワークスペースパッケージ。ドキュメント化されたカラー・スペーシング・角丸のトークン体系（`src/foundations/tokens.css`）と、Button・Card・Input・Checkbox・RadioButton・Accordion・SearchBar・ListItem・Link・Divider・Badgeの11コンポーネント、独自アイコン13種を提供しており、モジュール要件の「最低10コンポーネント」を満たしている。フロントエンドからは `otsukimi-ui: workspace:*` として利用し、Storybook自体も単独でデプロイしている。

**担当:** takitaga

---

### 高度な検索機能 — Minor, 1pt

全ユーザーのタスクが1つの共有一覧に表示されるため、自分に関係のあるものへ絞り込めるようにした。

**実装内容:** `searchTaskSchema`（`apps/backend/src/features/task/schema.ts`）が `GET /tasks` を支えており、フリーテキスト検索（`q`）、複数値指定可能な `status`・`priority` フィルタ、期限の範囲指定（`dueFrom`/`dueTo`）、`createdBy`/`assigneeId` フィルタ、5項目（`createdAt`・`updatedAt`・`dueAt`・`status`・`priority`）でのソート（`asc`/`desc`）、ページネーションに対応している。

**担当:** genomoto

---

## Accessibility and Internationalization

### 多言語対応 — Minor, 1pt

**実装内容:** `react-i18next` により、日本語・英語・中国語の3言語の完全な翻訳セット（`apps/frontend/src/lib/i18n/locales/{ja,en,zh}/common.json`）と、UI上の言語切り替えを実装した。ユーザーに表示される文字列は、すべて翻訳レイヤーを経由する。

**担当:** ssoeno, genomoto

---

### 追加ブラウザ対応 — Minor, 1pt

この課題ではChrome対応が必須要件だが、このモジュールではさらに2ブラウザへ対応範囲を広げた。

**実装内容:** Chromeに加えてFirefox・Safariで手動テストを実施し、認証・タスクCRUD・管理画面・分析ダッシュボードなど主要フローを確認した。特別対応が必要なブラウザ固有のレイアウト崩れや、機能不具合は見つかっていない。

**担当:** genomoto

---

## User Management

### OAuth 2.0によるリモート認証 — Minor, 1pt

この課題ではメールとパスワードによる認証が必須だが、GitHubアカウントでも安全にログインできる仕組みを追加した。

**実装内容:** Better Authの `socialProviders` 設定（`apps/backend/src/auth/index.ts`）によるGitHub OAuth。フロントエンドには専用のサインインボタン（`GitHubSignIn.tsx`）を用意。OAuthのやり取りはBetter Authが処理し、得られたIDをローカルの `user`/`account` テーブルに紐付ける。

**担当:** genomoto

---

### 完全な2FAシステム — Minor, 1pt

アカウント乗っ取りへのハードルを上げる、標準的な手段として実装した。

**実装内容:** Better Authの `twoFactor` プラグイン（TOTP方式）を、issuer名 `LunaPhase` で設定。`two_factor` テーブルにシークレット・ハッシュ化されたバックアップコード・検証状態、そしてブルートフォース対策のロックアウト用フィールド（`failedVerificationCount`、`lockedUntil`）を保持している。フロントエンドでは、QRコードによる登録（`react-qr-code` 使用、`TotpSetup.tsx`）、ログイン時のチャレンジ画面（`TotpChallenge.tsx`）、コード入力フォーム（`TotpCodeForm.tsx`）を提供している。

**担当:** genomoto

---

### 高度な権限管理システム — Major, 2pt

管理者向けの画面（ユーザー管理、他ユーザーのタスクへの操作権限）があるため、一貫した権限チェックの仕組みを実装した。CRUD・ロール管理・ロールに応じた表示制御という、モジュール要件を満たしている。

**実装内容:** Better Authの `admin` プラグインにより、`admin` と `user` の2ロールを実装。管理者はユーザーの一覧・詳細閲覧・プロフィール更新・ロール変更・削除まで含む完全なCRUD（`apps/frontend/src/features/admin/api.ts`、サーバー側は `admin` プラグインのルートで処理）に加え、他ユーザーが作成したタスクの編集・削除も行える。一般ユーザーは、自分のタスクのみに操作が制限される。バックエンドのミドルウェア（`apps/backend/src/middleware/auth.ts`）が、管理者専用エンドポイントへの非管理者アクセスを拒否し、フロントエンドでも管理者専用UI（ユーザー管理画面、他ユーザーのタスクに対する操作）を非管理者からは隠している。

**担当:** genomoto

---

## Devops

### ログ管理基盤（ELK）— Major, 2pt

**選定理由:** 複数サービスがコンテナ上で動く構成では、`docker logs` だけでは調査やパターン把握のスケーラビリティに欠けるため、検索可能な集約ログストアが必要だった。

**実装内容:** バックエンドは `pino` と `@elastic/ecs-pino-format` により、Elastic Common Schema（ECS）形式の構造化ログを出力（`apps/backend/src/logger/index.ts`）。ElasticsearchとKibanaを `compose.yml` の専用サービスとして起動し、Kibanaはリバースプロキシ経由で、ログ閲覧・検索用に公開している。

**担当:** takitaga

> **補足:** ログはECS形式に整形されているが、Logstashによる収集・変換段階は未実装。課題ではElasticsearch・Logstash・Kibanaの3点セットが求められているため、ディフェンスでの説明が必要。

---

### PrometheusとGrafanaによる監視システム — Major, 2pt

**選定理由:** ログだけでなく、リソース使用状況やサービスの健全性（CPU/メモリ、コンテナ統計）を可視化し、障害が起きる前に気づける状態にしたかった。評価者にシステムの健全性を具体的に示せる材料にもなる。

**実装内容:** Prometheus（`infra/prometheus/prometheus.yml`）が `node-exporter`（ホストメトリクス）と `cadvisor`（コンテナ単位のメトリクス）をスクレイプ。Grafanaにはカスタムダッシュボード（`infra/grafana/dashboards/{cadvisor,node-exporter,custom}.json`）と、Discord Webhook宛のコンタクトポイントに連携したアラートルール（`infra/grafana/provisioning/alerting/`）を設定済み。

**担当:** genomoto

---

## Data and Analytics

### データ可視化を伴う高度な分析ダッシュボード — Major, 2pt

タスクのステータス・優先度などを、一目で把握できるサマリービューを実装した。

**実装内容:** `GET /analytics/summary`（`apps/backend/src/features/task/analytics.routes.ts`）が、タスク総数・完了率・期限超過数、ステータス別・優先度別の内訳を、期限範囲でのフィルタ付きで集計。フロントエンド（`apps/frontend/src/features/analytics/components/AnalyticsPage.tsx`）はこれをサマリーカードと割合バーとして表示し、`react-csv` によるCSVエクスポートにも対応している。

**担当:** ssoeno, genomoto

> **補足:** データのリアルタイム更新、インタラクティブなチャート・グラフの実装については、後ほど説明を追加する。

---

## Cybersecurity

### WAF/ModSecurity + HashiCorp Vault — Cybersecurity, Major

このモジュールは加点対象外。

OWASP Core Rule Setを組み込んだModSecurity自体は、リバースプロキシ上で実際に稼働している（ベースイメージに `owasp/modsecurity-crs` を使用、設定は `infra/nginx/nginx.conf`）。検知/ブロックモードで、チューニング済みのルール除外設定を行っている。ただしこのモジュールは「強化されたWAF」と「シークレット管理のためのHashiCorp Vault」の両方を要求しており、Vaultは未実装（シークレットは現状 `.env` ファイルで管理しており、専用のシークレット管理ツールは導入していない）。

**担当:** tamatsuu