import Avatar from 'boring-avatars'
import type { ComponentPropsWithoutRef, MouseEventHandler } from 'react'

interface UserAvatarProps {
  userId: string
  avatarUrl?: string | null
  alt?: string
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  buttonProps?: Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'onClick'>
}

export const UserAvatar = ({
  userId,
  avatarUrl,
  alt = '',
  className,
  onClick,
  buttonProps,
}: UserAvatarProps) => {
  const avatar = avatarUrl ? (
    <img src={avatarUrl} alt={alt} className={className} loading="lazy" />
  ) : (
    <Avatar name={userId} variant="beam" square className={className} />
  )

  if (!onClick) {
    return avatar
  }

  return (
    <button
      type="button"
      className="hover:-translate-y-0.5  transition-all duration-300 cursor-pointer hover:shadow-sm"
      onClick={onClick}
      {...buttonProps}
    >
      {avatar}
    </button>
  )
}
