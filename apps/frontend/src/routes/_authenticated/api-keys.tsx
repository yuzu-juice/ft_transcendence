import { createFileRoute } from '@tanstack/react-router'
import { ApiKeyPage } from '@/features/api-key/components/ApiKeyPage'

export const Route = createFileRoute('/_authenticated/api-keys')({
  component: ApiKeyPage,
})
