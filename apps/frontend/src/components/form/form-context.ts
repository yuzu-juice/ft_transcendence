import { createFormHookContexts } from '@tanstack/react-form'

// ref: https://tanstack.com/form/latest/docs/framework/react/guides/form-composition
export const {
  fieldContext, // 個別フィールドの状態を共有する
  formContext, // フォーム全体の状態や操作を共有する
  useFieldContext,
  useFormContext,
} = createFormHookContexts()
