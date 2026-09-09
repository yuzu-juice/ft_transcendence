import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './form-context'
import { FormTextField } from './TextField'
import { FormCheckboxField } from './CheckBox'
import { FormSelectField } from './Select'
import { FormTextAreaField } from './TextArea'

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: {
    TextField: FormTextField,
    TextAreaField: FormTextAreaField,
    CheckboxField: FormCheckboxField,
    SelectField: FormSelectField,
  },

  formComponents: {},
})
