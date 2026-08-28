import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  return <div className="p-2">Hello from SignIn!</div>
}
