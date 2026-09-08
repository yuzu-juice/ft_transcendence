import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Loading } from '@/components/ui/Loading'
import { formatTaskDateTime } from '@/features/task/time'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Card, Input } from 'otsukimi-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { apiKeyMutations } from '../mutation'
import { apiKeyQueries } from '../query'

export const ApiKeyPage = () => {
  const { t } = useTranslation()
  const query = useQuery(apiKeyQueries.list())
  const createMutation = useMutation(apiKeyMutations.create())
  const deleteMutation = useMutation(apiKeyMutations.delete())

  const [name, setName] = useState('')
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null)

  if (query.isPending) {
    return <Loading />
  }

  if (!query.isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <ErrorMessage error={query.error} />
        <div className="flex justify-center">
          <Button
            type="button"
            disabled={query.isFetching}
            onClick={() => {
              query.refetch()
            }}
          >
            {query.isFetching ? t('apiKeys.reload') : t('apiKeys.retry')}
          </Button>
        </div>
      </div>
    )
  }

  const onCreate = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return
    }

    try {
      const created = await createMutation.mutateAsync({
        name: trimmedName,
      })
      setCreatedApiKey(created.key)
      setName('')
    } catch {
      // no-op: error presentation is handled elsewhere
    }
  }

  const onCopy = async () => {
    if (!createdApiKey) {
      return
    }

    try {
      await navigator.clipboard.writeText(createdApiKey)
      toast.success(t('apiKeys.copied'))
    } catch {
      toast.error(t('apiKeys.copyFailed'))
    }
  }

  const onDelete = async (apiKeyId: string, apiKeyName: string) => {
    const agreed = window.confirm(t('apiKeys.deleteConfirm', { name: apiKeyName }))
    if (!agreed) {
      return
    }

    try {
      await deleteMutation.mutateAsync(apiKeyId)
      toast.success(t('apiKeys.deleted'))
    } catch {
      // no-op: error presentation is handled elsewhere
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-heading font-bold">{t('apiKeys.title')}</h2>

      <Card>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">{t('apiKeys.description')}</p>
          <label className="text-sm font-bold text-brand-primary" htmlFor="api-key-name">
            {t('apiKeys.nameLabel')}
          </label>
          <p className="text-xs text-gray-600">{t('apiKeys.nameRequiredHint')}</p>
          <form
            className="flex flex-col gap-3 md:flex-row"
            onSubmit={(event) => {
              event.preventDefault()
              void onCreate()
            }}
          >
            <Input
              id="api-key-name"
              value={name}
              maxLength={100}
              onChange={(event) => {
                setName(event.currentTarget.value)
              }}
              placeholder={t('apiKeys.namePlaceholder')}
              className="w-full"
            />
            <Button type="submit" disabled={createMutation.isPending || name.trim().length === 0}>
              {createMutation.isPending ? t('apiKeys.creating') : t('apiKeys.create')}
            </Button>
          </form>
        </div>
      </Card>

      {createdApiKey && (
        <Card>
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-heading font-bold">{t('apiKeys.createdTitle')}</h3>
            <p className="text-sm text-red-600">{t('apiKeys.createdDescription')}</p>
            <div className="rounded-sm bg-gray-100 p-3 font-mono text-sm break-all">
              {createdApiKey}
            </div>
            <div className="flex justify-end gap-2">
              {/* 平文キーをメモリから消し、UIを閉じる */}
              <Button type="button" variant="transparent" onClick={() => setCreatedApiKey(null)}>
                {t('common.close')}
              </Button>
              <Button type="button" onClick={() => void onCopy()}>
                {t('apiKeys.copy')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-heading font-bold">{t('apiKeys.listTitle')}</h3>

          {query.data.length === 0 && <p className="text-sm text-gray-600">{t('apiKeys.empty')}</p>}

          {query.data.map((apiKey) => (
            <div key={apiKey.id} className="rounded-sm border border-gray-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-1.5">
                  <p className="font-bold">{apiKey.name}</p>
                  <p className="text-sm text-gray-700">
                    {t('apiKeys.keyPrefix')}: {apiKey.keyPrefix}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t('apiKeys.createdAt')}: {formatTaskDateTime(apiKey.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {t('apiKeys.lastUsedAt')}:{' '}
                    {apiKey.lastUsedAt
                      ? formatTaskDateTime(apiKey.lastUsedAt)
                      : t('apiKeys.neverUsed')}
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    void onDelete(apiKey.id, apiKey.name)
                  }}
                >
                  {deleteMutation.isPending ? t('apiKeys.deleting') : t('apiKeys.delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
