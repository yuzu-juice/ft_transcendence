import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form-context'
import { FormTextField } from './TextField'
import { FormCheckboxField } from './CheckBox'

export const getFormErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') {
    return error
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  return undefined
}

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: {
    TextField: FormTextField,
    CheckboxField: FormCheckboxField,
  },

  formComponents: {},
})
