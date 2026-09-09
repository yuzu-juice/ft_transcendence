import z from 'zod'
import { toDateTimeLocal } from '../task/time'

export const DEFAULT_ANALYTICS_SUMMARY_FORM_VALUE = {
  dueFrom: '',
  dueTo: '',
  assigneeId: '',
}

export const AnalyticsSummaryParamsSchema = z.object({
  dueFrom: z.iso.datetime().optional().catch(undefined),
  dueTo: z.iso.datetime().optional().catch(undefined),
  assigneeId: z.string().optional().catch(undefined),
})

export type AnalyticsSummaryParams = z.infer<typeof AnalyticsSummaryParamsSchema>

export const AnalyticsSummaryFormSchema = z
  .object({
    dueFrom: z.string(),
    dueTo: z.string(),
    assigneeId: z.string(),
  })
  .refine(
    (data) =>
      !(data.dueFrom !== '' && data.dueTo !== '' && new Date(data.dueFrom) > new Date(data.dueTo)),
    {
      message: 'analytics.validation.dueRange.invalid',
      path: ['dueTo'],
    },
  )

export type AnalyticsSummaryFormValues = z.infer<typeof AnalyticsSummaryFormSchema>

export const toAnalyticsSummaryParams = (
  form: AnalyticsSummaryFormValues,
): AnalyticsSummaryParams => ({
  dueFrom: form.dueFrom ? new Date(form.dueFrom).toISOString() : undefined,
  dueTo: form.dueTo ? new Date(form.dueTo).toISOString() : undefined,
  assigneeId: form.assigneeId || undefined,
})

export const toAnalyticsSummaryFormValues = (
  search: AnalyticsSummaryParams,
): AnalyticsSummaryFormValues => ({
  dueFrom: toDateTimeLocal(search.dueFrom) || '',
  dueTo: toDateTimeLocal(search.dueTo) || '',
  assigneeId: search.assigneeId || '',
})
