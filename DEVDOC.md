# Development Guide

## 必須ライブラリ・パッケージ

あらかじめ以下に示すライブラリやパッケージを導入してください。

- Docker・Docker Compose
- Node.js
- pnpm

## 環境変数の準備

`.env.example`を`.env`へコピーし、環境変数を設定してください。
以下に示す通り、一部の環境変数には設定の制約が存在します。

- `DATABASE_URL` : `postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@database:5432/<POSTGRES_DB>`
- `BETTER_AUTH_SECRET` : `openssl rand -base64 32`により生成された値

## 開発環境の起動

Docker Composeを使用して起動します。
`--watch` オプションにより、ソースコードの変更を監視してコンテナへ反映し、同期・再ビルドを行います。

```sh
docker compose up --watch
```

ログを確認する場合:

```sh
docker compose logs -f
```

開発環境を停止する場合:

```sh
docker compose down
```

## アクセス先

開発環境では以下の通りアクセスすることができます。

フロントエンド: `http://localhost:8080`
バックエンド: `http://localhost:8080/api/`

## パッケージ管理

パッケージの管理にはpnpm workspaceを使用しています。
基本的にコマンドはリポジトリルートから**dockerコンテナ外で**実行してください。

依存関係のインストール:

```sh
pnpm install
```

フロントエンドにパッケージを追加する:

```sh
pnpm --filter frontend add <package>
pnpm --filter frontend add -D <develop package>
```

バックエンドにパッケージを追加する:

```sh
pnpm --filter backend add <package>
```

Workspace全体で使用するパッケージを追加する

```sh
pnpm add -Dw <package>
```

## ローカルで直接実行する

Dockerを介さず、ローカル環境で動作を確認することもできます。

```sh
pnpm --filter frontend dev
pnpm --filter backend dev
```

この場合、以下の通りアクセスできます。

フロントエンド: `http://localhost:5173`
バックエンド: `http://localhost:3000`

## Formatter・Linter

Formatter・LinterにはBiomeを使用しています。
フロントエンド・バックエンドをまとめて検査します。

```sh
pnpm check # チェックのみ
pnpm check:write # 自動修正
pnpm format # フォーマット
pnpm lint # Lintのみ
```

一部のエディタにおいて、Biomeの公式プラグインが提供されているものがありますので、ご自身の環境に合わせて導入してください。詳細は[Biome公式の拡張機能 | Biome](https://biomejs.dev/ja/editors/first-party-extensions/)をご覧ください。
本環境では`lefthook`を使用することで、`git commit`時に自動的にBiomeが実行されます。
