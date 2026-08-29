import { Input, type InputProps } from 'otsukimi-ui'
import { useId, type ReactNode } from 'react'
import { useFieldContext } from './form-context'
import { getFormErrorMessage } from './form'

type TextFieldProps = InputProps & {
  label: ReactNode
  error?: string
}

// otsukimi-uiを包む純粋な表示コンポーネント
const TextField = ({
  label,
  error,
  id,
  className,
  'aria-describedby': ariaDescribedBy, // HTML要素に対して補足説明や詳細な情報が書かれている別の要素のIDを指定する属性
  ...props
}: TextFieldProps) => {
  const generatedId = useId() // アクセシビリティ属性に渡すことができる一意の ID を生成するための React フック
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  // filter(Boolean)は空要素を排除するためのイディオム
  const describedby =
    [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-brand-primary">
        {label}
      </label>
      <Input
        {...props}
        id={inputId}
        className={`w-full ${className ?? ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedby}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

// TextFieldPropsから`name`以降を除いたものを受け取る
// ここに列挙されているフィールドはpropsで受け取るのではなく、コンポーネント内部のuseFieldContextから取得する
type FormTextFieldProps = Omit<
  TextFieldProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
>

// UIとTanstack Form接続用のコンポーネント
export const FormTextField = (props: FormTextFieldProps) => {
  const field = useFieldContext<string>()

  const firstError = field.state.meta.errors[0]
  const error =
    field.state.meta.isTouched && !field.state.meta.isValid
      ? getFormErrorMessage(firstError)
      : undefined

  return (
    <TextField
      {...props}
      id={props.id ?? field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(event) => {
        field.handleChange(event.currentTarget.value)
      }}
      error={error}
    />
  )
}
