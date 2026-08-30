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
- `INITIAL_ADMIN_PASSWORD` : 8文字以上128文字以下の文字列

## 開発環境の起動

```sh
pnpm dev
```

内部的にはDocker Composeを使用して起動します。ソースコードの変更を監視してコンテナへ反映し、同期・再ビルドを行います。

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
パッケージ追加後は必ず`docker compose build`の上コンテナを起動してください。

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

## バックエンド

Docker Composeを使用してはじめて起動する際には、初期adminユーザの作成、およびダミーのユーザ・タスクの作成（以下、シード値の作成）が自動で実施されます。
作成されるシード値の内容については`backend/scripts`以下のファイルを参照してください。

このデータは`postgres-data`volumeに保存されています。データベースをリセットしたい場合は、このvolumeを削除してください。
その後でDocker Composeを使用してコンテナを起動すると、再度シード値が作成されます。

```sh
docker volume rm ft_transcendence_postgres-data
```

バックエンドの挙動を確認する際には[HTTPie](https://httpie.io/)を使用することをお勧めします。`curl`コマンドと比較してリクエストのための記述が容易であり、レスポンスも整形されて表示されるためです。
以下、HTTPieコマンドを使用することを前提に記述します。

### アカウントへのログイン

`/api/auth/sign-in/email`にアカウントの`email`と`password`をパラメータにとって`GET`リクエストすることでセッションを開始することができます

- `--session=<session name>`を使用することで、自動的にCookie等を解析しセッションを管理してくれます
- `http://localhost`を省略し、単に`:8080`とポート番号からURLを記述することができます
- `PUT`, `PATCH`時などデータフィールドにパラメータを含めたい場合は`key=value`のように記述します
- `Origin:http://localhost:8080`のように`Origin`を含めない場合、Better Authによるセキュリティ設定のためアクセスが拒否されることがあります

```sh
httpie --session=alice :8080/api/auth/sign-in/email email=alice@example.test password=password123 Origin:http://localhost:8080
```

### httpieの使い方

- URLの前に`GET`や`PUT`などメソッドを記述します（`GET`は省略可能）
- データフィールドのパラメータとして配列を含めたい場合は`key:=[value, value]`のように記述します
- クエリを含めたい場合は`key==value`のように記述します
- 画像を含めたい場合は`--form`オプションを使用します。ファイル名は`フィールド名@パス`形式で記述します

```sh
httpie --session=alice PUT :8080/path/to/api queryKey==queryValue
httpie --form --session=alice PUT :8080/api/internal/me/avatar avatar@./avatar.png
```

### Drizzle ORM

バックエンドでは、Drizzle ORMを通じてデータベーススキーマを管理しています。
`backend/src/db/schema`ディレクトリ以下にTypeScriptを使用してスキーマを定義しています。

スキーマの追加や変更を行った際は、以下のコマンドを実行してください。

```sh
pnpm --filter backend run db:generate
```

これにより、`backend/drizzle`以下にmigrationファイルが生成されます。生成されたファイルはGitの管理下においてください。
Docker Composeによる起動時に自動的にマイグレーションが実行されます。手動で

```sh
pnpm --filter backend run db:migrate
```

を実行する必要はありません。

### OpenAPI

Internal APIのリファレンスとしてOpenAPI形式のファイル（`backend/docs/openapi-internal.yaml`）を（Codexが）作成しています。
[SwaggerEditor](https://editor.swagger.io/)等のオンラインエディタによりグラフィカルに確認することができます。

### トラブルシューティング

- Docker Composeの設定により、バックエンドのソースコードを更新した際にはサーバが自動的に再起動することになっています。`Syncing service "backend" after 1 changes were detected`に続けて`Server is running on http://localhost:3000`というメッセージが表示されれば再起動されたことを意味しますが、たまにそのようにならないケースが存在します。
- 再起動は全てを解決します。特にソースコードを書き換えた直後に期待通りの挙動を示さない場合、一度`docker compose down`した後に、再度`docker compose up --watch`を実行してみてください。
