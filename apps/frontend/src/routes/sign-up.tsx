import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
})

function SignUp() {
  return <div className="p-2">Hello from SignUp!</div>
}
