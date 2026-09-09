import { useFormErrorMessage } from './form-error'

interface FormErrorMessage {
  error: unknown
}

export const FormErrorMessage = ({ error }: FormErrorMessage) => {
  const message = useFormErrorMessage(error)

  if (!message) {
    return null
  }

  return (
    <p role="alert" className="text-sm text-red-600">
      {message}
    </p>
  )
}
