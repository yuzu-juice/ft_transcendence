# モジュール選定理由（日本語版）

申告ポイント合計: **20点**（必須14点 + ボーナス6点）

---

## Web

### Use a framework for both the frontend and backend. — Major, 2pt

Webアプリケーション開発の基盤として既存のフレームワークを採用することで、一般的なWebアプリケーションに必要な仕組みを0から再実装せず、機能開発に集中する構成とした。多くの機能において、フレームワークに合わせた既存のライブラリを活用することで開発者体験や開発速度の向上を図った。

実装内容: フロントエンドではReact19を採用し、コンポーネント単位として画面の状態を構成している。バックエンドではhonoを採用し、HTTPリクエストのルーティングを中心としたWeb APIを構成している。

**担当:** genomoto

---

### Public API — Major, 2pt

ブラウザのセッションを介さず、外部クライアント（スクリプトや外部連携）からタスクデータを読み書きできるようにした。レート制限は1分あたり30回（APIキー単位）。

**実装内容:** `apps/backend/src/features/task/public.ts` にて、Bearer形式のAPIキー認証つきで5つのエンドポイントを公開。

- `GET /api/v1/tasks` — ページネーション付き一覧
- `POST /api/v1/tasks` — 新規作成
- `GET /api/v1/tasks/{taskId}` — 詳細取得
- `PATCH /api/v1/tasks/{taskId}` — 部分更新
- `DELETE /api/v1/tasks/{taskId}` — 削除（キー所有者自身が作成したタスクのみ）

APIキーは `ft_<prefix>_<secret>` の形式で発行し、SHA-256でハッシュ化して保存（`apps/backend/src/features/api-key/service.ts`）。平文で保持するのは識別用のprefix部分のみ。リクエストはAPIキー単位で1分間30リクエストにレート制限（`hono-rate-limiter`）。仕様は `/api/v1/docs` のSwagger UIから閲覧・実行できる。

**担当:** ssoeno

---

### Use an ORM for the database（Drizzle ORM）— Minor, 1pt

型安全なORMを採用し、データベースの操作やスキーマの定義をTypeScriptで型安全に記述出来るようにし、SQLの組み立てや型の不一致などによる実装ミスを減らした。

**実装内容:** タスク・ユーザー・APIキー・better-auth関連テーブルなど、バックエンドのデータベースアクセスで `drizzle-orm` を使用している。マイグレーションファイルの生成・実行には `drizzle-kit` を使用し、マイグレーションは `apps/backend/drizzle/` にコミット済み。

**担当:** genomoto

---

### カスタムデザインシステム — Minor, 1pt

共有のコンポーネントライブラリを持つことで、見た目の一貫性を保った。

**実装内容:** `packages/otsukimi-ui` は、独自のStorybook・CI・リリースパイプラインを持つ独立したワークスペースパッケージ。`src/foundations/tokens.css` に、背景・ブランド・アクセント・テキストなどのカラーパレット、スペーシング・角丸、本文用と見出し用のタイポグラフィ（`LINE Seed JP`・`Zen Maru Gothic`）をデザイントークンとして定義している。さらに、Button・Card・Input・Checkbox・RadioButton・Accordion・SearchBar・ListItem・Link・Divider・Badgeの11個の再利用可能なコンポーネントと、独自アイコン13種を提供しており、モジュール要件の「最低10コンポーネント」を満たしている。フロントエンドからは `otsukimi-ui: workspace:*` として利用し、Storybook自体も単独でデプロイしている。

**担当:** takitaga

---

### 高度な検索機能 — Minor, 1pt

全ユーザーのタスクが1つの共有一覧に表示されるため、アプリ内で管理しているタスクについて、タスクの属性による絞り込みや並び替えができるようにした。

**実装内容:** `searchTaskSchema`（`apps/backend/src/features/task/schema.ts`）が `GET /tasks` を支えており、フリーテキスト検索（`q`）、複数値指定可能な `status`・`priority` フィルタ、期限の範囲指定（`dueFrom`/`dueTo`）、`createdBy`/`assigneeId` フィルタ、5項目（`createdAt`・`updatedAt`・`dueAt`・`status`・`priority`）でのソート（`asc`/`desc`）、ページネーションに対応している。

**担当:** genomoto

---

## Accessibility and Internationalization

### Support for multiple languages (at least 3 languages) — Minor, 1pt

利用者の言語に依存せず、同じタスク管理機能を利用できるようにするため、多言語対応を実装した。

**実装内容:** `react-i18next` により、日本語・英語・中国語の3言語の完全な翻訳セット（`apps/frontend/src/lib/i18n/locales/{ja,en,zh}/common.json`）と、UI上の言語切り替えを実装した。ユーザーに表示される主要な文字列は翻訳レイヤーを経由する。

**担当:** ssoeno, genomoto

---

### Support for additional browsers — Minor, 1pt

利用者が使用するブラウザに左右されず、安定してアプリケーションを利用できるようにするため、主要なブラウザへの対応を確認した。

Chromeに加えてEdge・Brave・Chromiumで手動テストを実施し、認証・タスクCRUD・管理画面・分析ダッシュボードなど主要フローを確認した。特別対応が必要なブラウザ固有のレイアウト崩れや、機能不具合は見つかっていない。

**担当:** genomoto

---

## User Management

### Implement remote authentication with OAuth 2.0 — Minor, 1pt

この課題ではメールとパスワードによる認証が必須だが、GitHubアカウントでも安全にログインできる仕組みを追加した。

**実装内容:** Better Authの `socialProviders` 設定（`apps/backend/src/auth/index.ts`）の`socialProviders`機能を用いて、GitHubアカウントによる認証・ログインを実現した。フロントエンドには専用のサインインボタン（`GitHubSignIn.tsx`）を用意。OAuthのやり取りはBetter Authが処理し、得られたIDを本アプリケーションのデータベースにある `user`/`account` テーブルに紐付ける。

**担当:** genomoto

---

###  Implement a complete 2FA (Two-Factor Authentication) system for the users — Minor, 1pt

アカウント乗っ取りへのハードルを上げる、標準的な手段として実装した。

**実装内容:** Better Authの `twoFactor` プラグイン（TOTP方式）を、issuer名 `LunaPhase` で設定。Google Authenticatorを利用してワンタイムパスワードを発行し、ログイン時の本人確認に使用できる。`two_factor` テーブルにはシークレット・検証状態・ブルートフォース対策のロックアウト用フィールド（`failedVerificationCount`、`lockedUntil`）を保持している。フロントエンドでは、QRコードによる登録（`react-qr-code` 使用、`TotpSetup.tsx`）、ログイン時のチャレンジ画面（`TotpChallenge.tsx`）、コード入力フォーム（`TotpCodeForm.tsx`）を提供している。

**担当:** genomoto

---

### Advanced permissions system 高度な権限管理システム — Major, 2pt

フロントエンド、バックエンドで一貫した権限チェックを行い、管理者限定の機能（ユーザの管理、他ユーザの作成したタスクの削除権限）を実装した。

**実装内容:** Better Authの `admin` プラグインにより、`admin` と `user` の2ロールを実装している。管理者はユーザーの一覧・詳細閲覧、プロフィール編集、アカウント削除ができ、ユーザーのロールを変更できる。管理者専用のユーザー管理画面があり、一般ユーザーとは異なる画面と操作を提供している（`apps/frontend/src/features/admin/api.ts`）。バックエンドでは `requireAdmin` ミドルウェア（`apps/backend/src/middleware/auth.ts`）により、管理者専用エンドポイントへのアクセスを管理者に限定している。

**担当:** genomoto

---

## Devops

### Infrastructure for log management using ELK (Elasticsearch, Logstash,
Kibana) — Major, 2pt

複数サービスがコンテナ上で動く構成では、`docker logs` だけでは調査やパターン把握のスケーラビリティに欠けるため、検索可能な集約ログストアを用意した。

**実装内容:** バックエンドは `pino` と `@elastic/ecs-pino-format` により、Elastic Common Schema（ECS）形式の構造化ログを出力（`apps/backend/src/logger/index.ts`）。DockerのGELFロギングドライバーでバックエンドのコンテナログをLogstashへ転送し、LogstashのGELF入力で受信した後、JSONの解析とフィールド変換を行い、Elasticsearchへ出力するパイプライン（`infra/logstash/logstash.conf`）を構成している。ElasticsearchとKibanaも `compose.yml` の専用サービスとして起動し、Kibanaはリバースプロキシ経由でログ閲覧用に公開している。ElasticSearchが取得したログデータは7日保持したのち削除している。また、毎日データのスナップショットを作成しており、30日間保持したのち削除している。

**担当:** takitaga

---

### Monitoring system with Prometheus and Grafana — Major, 2pt

ログだけでなく、リソース使用状況やサービスの健全性（CPU/メモリ、コンテナ統計）を可視化し、障害が起きる前に気づける状態にした。評価者にシステムの健全性を具体的に示せる材料にもなる。

**実装内容:** Prometheus（`infra/prometheus/prometheus.yml`）が `node-exporter`（ホストメトリクス）と `cadvisor`（コンテナ単位のメトリクス）をスクレイプ。Grafanaにはカスタムダッシュボード（`infra/grafana/dashboards/{cadvisor,node-exporter,custom}.json`）と、Discord Webhook宛のコンタクトポイントに連携したアラートルール（`infra/grafana/provisioning/alerting/`）を設定済み。

**担当:** genomoto

---

## Data and Analytics

### Advanced analytics dashboard with data visualization — Major, 2pt

タスクのステータスや優先度などを集計し、全体の状況を把握できるサマリービューを実装した。

**実装内容:** `GET /analytics/summary`（`apps/backend/src/features/task/analytics.routes.ts`）が、タスク総数・完了率・期限超過数、ステータス別・優先度別の内訳を、期限範囲でのフィルタ付きで集計。フロントエンド（`apps/frontend/src/features/analytics/components/AnalyticsPage.tsx`）はこれをサマリーカードと割合バーとして表示し、`react-csv` によるCSVエクスポートにも対応している。ポーリングによりデータの30秒ごとのリアルタイム更新、Tanstack Chartsを利用したインタラクティブな円グラフも実装した。

**担当:** ssoeno, genomoto

---

## Cybersecurity

### WAF/ModSecurity + HashiCorp Vault — Cybersecurity, Major

このモジュールは加点対象外。

OWASP Core Rule Setを組み込んだModSecurity自体は、リバースプロキシ上で実際に稼働している（ベースイメージに `owasp/modsecurity-crs` を使用、設定は `infra/nginx/nginx.conf`）。検知/ブロックモードで、チューニング済みのルール除外設定を行っている。ただしこのモジュールは「強化されたWAF」と「シークレット管理のためのHashiCorp Vault」の両方を要求しており、Vaultは未実装（シークレットは現状 `.env` ファイルで管理しており、専用のシークレット管理ツールは導入していない）。

**担当:** tamatsuu

---
## カスタムモジュール（WebMCP） - Minor 1 point

AIエージェントに対してWebアプリケーションの機能を構造化されたツールとして公開するWebMCPを導入し、人間向けのUIとは別に、AIエージェントがアプリケーションの機能を直接利用できるインターフェースを提供している。

**対処する技術的課題** : 一般的なブラウザ操作型のAIエージェントは、DOMや画面上の要素を解析し、ボタンのクリックやフォーム入力など、人間向けに設計されたUIを介してアプリケーションを操作する必要がある。この方式では、画面構造の解析が必要になり、UIの変更によって操作が不安定になるほか、対象となる操作や入力値をAI側で推測する必要がある。WebMCPでは、ツール名、説明、入力スキーマを持つ構造化されたインターフェースとしてアプリケーションの機能を公開できる。これにより、AIエージェントはDOMや画面構造を解釈して操作方法を推測する代わりに、アプリケーション側が明示的に定義した機能を呼び出せる。結果として、AIエージェントによる操作の効率性と予測可能性を高め、UI構造への依存を減らすことができる。

**プロジェクトに価値を付加する方法** : 通常のWeb UIに加えてAIエージェント向けの操作インターフェースを提供することで、同じタスク管理機能を人間だけでなくWebMCP対応のAIエージェントからも利用できるようにする。ユーザが画面上で個別に操作しなくても、AIエージェントを介してタスクの検索、作成、編集、担当者の割り当てなどを実行できる。これにより、本アプリケーションをAIエージェントを介した操作にも対応できるようになり、利用方法を拡張している。

**モジュールステータスに値する理由**: 本実装では、AIエージェントにどの操作を公開するかを選定し、各ツールの責務や入力項目を整理した。また、アプリケーションの既存の実装を組み合わせ人間に対するuiと矛盾しない形で実装した。コードベースを複雑化させることなく、安全な形でAIエージェントをうけ入れることに成功した。

**実装内容** : WebMCPのツールとして、ログインユーザの情報及びタスクの検索・詳細・作成・編集・担当者の割り当て機能を公開している。各ツールには処理内容と入力スキーマを定義しています。
