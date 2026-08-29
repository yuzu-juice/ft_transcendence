import { useId } from 'react'
import { Checkbox, type CheckboxProps } from 'otsukimi-ui'
import { useFieldContext } from './form-context'

type CheckboxFieldProps = CheckboxProps & {
  error?: string
}

// otsukimi-uiを包む純粋な表示コンポーネント
const CheckboxField = ({ error, id, ...props }: CheckboxFieldProps) => {
  const generatedId = useId() // アクセシビリティ属性に渡すことができる一意の ID を生成するための React フック
  const inputId = id ?? generatedId

  return <Checkbox {...props} id={inputId} aria-invalid={error ? true : undefined} />
}

type FormCheckboxFieldProps = Omit<
  CheckboxFieldProps,
  'name' | 'checked' | 'defaultChecked' | 'onChange' | 'onBlur'
>

// UIとTanstack Form接続用のコンポーネント
export const FormCheckboxField = (props: FormCheckboxFieldProps) => {
  const field = useFieldContext<boolean>()

  return (
    <CheckboxField
      {...props}
      id={props.id ?? field.name}
      name={field.name}
      checked={field.state.value}
      onBlur={field.handleBlur}
      onChange={(event) => {
        field.handleChange(event.currentTarget.checked)
      }}
    />
  )
}
