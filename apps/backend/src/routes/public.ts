import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { publicTasks } from '../features/task/public.js'
import { requireApiKey } from '../middleware/api-key-auth.js'

const publicApi = new OpenAPIHono()

// publicApi
// ├── GET  /docs          → Swagger UIの画面（認証不要）
// ├── GET  /docs/openapi  → OpenAPI定義のJSON（認証不要）
// └── /tasks      → requireApiKey を通過
//     ├── GET    /tasks
//     ├── POST   /tasks
//     ├── GET    /tasks/:taskId
//     ├── PATCH  /tasks/:taskId
//     └── DELETE /tasks/:taskId

// '/docs/openapi'というURLにアクセスされたら
// publicApiが持っているルート情報（createRouteで定義したもの全部）を、OpenAPI形式のJSONとして返す
// url: '/'は「今アクセスしているホストがそのままAPIサーバー」
publicApi.doc('/docs/openapi', {
  openapi: '3.1.0',
  info: {
    title: 'Transcendence Public API',
    version: '0.1.0',
    description: 'Public API for API key based access',
  },
  servers: [
    { url: '/v1', description: 'Direct backend access (no reverse proxy)' },
    { url: '/api/v1', description: 'Behind reverse proxy (nginx exposes the API under /api)' },
  ],
  security: [{ Bearer: [] }],
})

publicApi.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  description: 'Public API key issued via the internal API',
})

// '/docs'というURLにブラウザでアクセスされたら、Swagger UIのHTML画面を返す
// ブラウザ側がOpenAPIの中身をどこに取りに行くかを指定するオプションであり
// nginxを経由するので、/api/込みの絶対パスを指定。
publicApi.get('/docs', swaggerUI({ url: './docs/openapi' }))

// Honoのパスマッチングでは
// /tasks/*という書き方だけだと、/tasksの末尾に何も付かない場合にマッチしないことがある
publicApi.use('/tasks', requireApiKey)
publicApi.use('/tasks/*', requireApiKey)

publicApi.route('/tasks', publicTasks)

export default publicApi
// index.tsがimport publicApi from './routes/public.js'として受け取り、
// app.route('/', publicApi)でメインのアプリに組み込む
