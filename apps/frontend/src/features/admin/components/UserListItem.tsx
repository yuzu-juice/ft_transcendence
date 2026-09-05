import { UserAvatar } from '@/components/ui/UserAvatar'
import type { User } from '../api'
import { Badge } from 'otsukimi-ui'

interface TaskListItemProps {
  user: User
  onModalOpen: () => void
}

export const UserListItem = ({ user, onModalOpen }: TaskListItemProps) => {
  return (
    <tr key={user.id} className="border-b border-brand-primary-soft">
      <td className="px-4 py-3">
        <UserAvatar
          userId={user.id}
          avatarUrl={user.image}
          alt={`${user.name}のアバター`}
          className="size-8 shrink-0 rounded-xs"
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap font-bold">{user.name}</td>
      <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <Badge className="w-fit" variant={user.role === 'admin' ? 'default' : 'moonlight'}>
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          type="button"
          className="text-cyan-600 cursor-pointer hover:underline hover:text-cyan-700 transition duration-300 "
          onClick={() => onModalOpen()}
        >
          詳細
        </button>
      </td>
    </tr>
  )
}
