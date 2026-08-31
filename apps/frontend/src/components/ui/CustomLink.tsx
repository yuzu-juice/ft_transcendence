import * as React from 'react'
import { createLink, type LinkComponent } from '@tanstack/react-router'
import { Link as OtsukimiLink } from 'otsukimi-ui'

// Ostukimi UIのLinkコンポーネントのデザインと
// Tanstack Routerで使用するLinkコンポーネントによる型安全なルーティングを両立させる
// ref: https://tanstack.com/router/latest/docs/guide/custom-link

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  // Add any additional props you want to pass to the anchor element
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>((props, ref) => {
  return <OtsukimiLink ref={ref} {...props} />
})

const CreatedLinkComponent = createLink(BasicLinkComponent)

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}
