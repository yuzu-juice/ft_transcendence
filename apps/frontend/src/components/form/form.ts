import { createFormHook } from '@tanstack/react-form'
import { FormCheckboxField } from './CheckBox'
import { fieldContext, formContext } from './form-context'
import { FormSelectField } from './Select'
import { FormTextAreaField } from './TextArea'
import { FormTextField } from './TextField'

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
