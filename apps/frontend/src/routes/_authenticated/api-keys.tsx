import { ApiKeyPage } from '@/features/api-key/components/ApiKeyPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/api-keys')({
  component: ApiKeyPage,
})
