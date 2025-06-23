'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof NextLink>

export default function Link({ children, ...props }: LinkProps) {
  const router = useRouter()
  const isExternal = props.href.toString().startsWith('http')

  if (isExternal) {
    // Extract Next.js specific props that don't apply to regular anchor tags
    const { href, prefetch, replace, scroll, shallow, locale, ...anchorProps } = props

    return (
      <a
        href={href.toString()}
        target={props.target || '_blank'}
        rel={props.rel || 'noopener noreferrer'}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink
      {...props}
      prefetch={false}
      onMouseEnter={() => {
        // Prefetch on hover for faster navigation
        router.prefetch(props.href.toString())
      }}
      onMouseDown={(e) => {
        // Navigate immediately on mouse down for faster perceived performance
        if (
          e.button === 0 && // Left mouse button
          !e.altKey && // No modifier keys pressed
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault() // Prevent default link behavior
          router.push(props.href.toString()) // Navigate immediately
        }
      }}
    >
      {children}
    </NextLink>
  )
}
