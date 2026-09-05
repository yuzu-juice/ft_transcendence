import { useId, type ComponentPropsWithRef } from 'react'
import { getFormErrorMessage } from './form'
import { useFieldContext } from './form-context'

type SelectOption<T extends string> = {
  value: T
  label: string
}

type SelectProps = ComponentPropsWithRef<'select'>

type SelectFieldProps<T extends string> = SelectProps & {
  value: T
  onValueChange: (value: T) => void
  options: SelectOption<T>[]
  label: string
  error?: string
}

export function SelectField<T extends string>({
  value,
  onValueChange,
  options,
  label,
  error,
  id,
  className,
  ref,
  'aria-describedby': ariaDescribedBy,
  ...props
}: SelectFieldProps<T>) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  const describedby =
    [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm font-bold text-brand-primary">
      {label}

      <select
        {...props}
        id={inputId}
        ref={ref}
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
        className={`box-content h-[3em] text-black font-normal text-base rounded-md border border-border px-[1em] focus:border-2 focus:border-brand-primary-deep focus:outline-none focus:ring-brand-primary-deep transition duration-150  ${className ?? ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedby}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </label>
  )
}

export function FormSelectField<T extends string>({
  label,
  options,
}: {
  label: string
  options: SelectOption<T>[]
}) {
  const field = useFieldContext<T>()

  const firstError = field.state.meta.errors[0]
  const error =
    field.state.meta.isTouched && !field.state.meta.isValid
      ? getFormErrorMessage(firstError)
      : undefined

  return (
    <SelectField
      label={label}
      value={field.state.value}
      onValueChange={field.handleChange}
      options={options}
      error={error}
    />
  )
}
