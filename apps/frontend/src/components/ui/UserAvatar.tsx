import Avatar from 'boring-avatars'
import { Button } from 'otsukimi-ui'
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
    <Button type="button" onClick={onClick} {...buttonProps}>
      {avatar}
    </Button>
  )
}
