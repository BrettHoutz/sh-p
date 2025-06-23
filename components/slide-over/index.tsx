'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useClickOutside } from '@/lib/hooks/client'

/**
 * Props for the SlideOver component
 */
type SlideOverProps = {
  children: ReactNode
  direction?: 'left' | 'right'
  isOpen: boolean
  onCloseAction: () => void
}

/**
 * SlideOver component that creates a modal-like panel that slides in from the left or right
 * Features:
 * - Smooth CSS transform animations
 * - Click outside to close functionality
 * - Body scroll locking when open
 * - Responsive width (full width on mobile, 1/3 width on desktop)
 * - Backdrop overlay
 */
export default function SlideOver({ children, direction = 'left', isOpen, onCloseAction }: SlideOverProps) {
  const slideOverRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close the slide-over
  useClickOutside(slideOverRef, () => {
    if (isOpen) onCloseAction()
  })

  // Lock body scrolling when slide-over is open to prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Calculate transform value based on direction and open state
  // Left: slides from -100% (hidden) to 0% (visible)
  // Right: slides from +100% (hidden) to 0% (visible)
  const transformValue =
    direction === 'left'
      ? isOpen
        ? 'translateX(0)' // Visible position
        : 'translateX(-100%)' // Hidden position (off-screen left)
      : isOpen
        ? 'translateX(0)' // Visible position
        : 'translateX(100%)' // Hidden position (off-screen right)

  // Set positioning class based on slide direction
  const positionClass = direction === 'left' ? 'left-0' : 'right-0'

  // Don't render anything if the slide-over is closed
  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Transparent backdrop overlay that covers the entire screen */}
      <div className="fixed inset-0 z-50" />

      {/* Main slide-over panel */}
      <div
        ref={slideOverRef}
        className={`fixed top-0 bottom-0 z-50 w-full bg-[black] text-[white] lg:w-1/3 ${positionClass} overflow-y-auto`}
        style={{
          transform: transformValue, // Apply the calculated transform
          transition: 'transform 0.3s ease-in-out', // Smooth animation transition
        }}
      >
        {children}
      </div>
    </>
  )
}
