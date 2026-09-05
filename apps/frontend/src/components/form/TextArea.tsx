import { useId, type ComponentPropsWithRef } from 'react'
import { useFieldContext } from './form-context'
import { getFormErrorMessage } from './form'

type TextAreaProps = ComponentPropsWithRef<'textarea'>

type TextAreaFieldProps = TextAreaProps & {
  label: string
  error?: string
  rows?: number
}

const TextAreaField = ({
  label,
  error,
  rows = 4,
  id,
  className,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextAreaFieldProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  const describedby =
    [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-bold text-brand-primary">
        {label}
      </label>
      <textarea
        {...props}
        id={inputId}
        ref={ref}
        className={`w-full resize-y outline-none rounded-md border border-border px-[1em] py-4 focus:border-2 focus:border-brand-primary-deep focus:outline-none focus:ring-brand-primary-deep transition duration-150 ${className ?? ''}`}
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

type FormTextAreaFieldProps = Omit<
  TextAreaFieldProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
>

export const FormTextAreaField = (props: FormTextAreaFieldProps) => {
  const field = useFieldContext<string>()

  const firstError = field.state.meta.errors[0]
  const error =
    field.state.meta.isTouched && !field.state.meta.isValid
      ? getFormErrorMessage(firstError)
      : undefined

  return (
    <TextAreaField
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
