'use client'

import { useEffect, RefObject, useCallback } from 'react'

// Hook to detect clicks outside a referenced element
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      // If element doesn't exist or click is inside, do nothing
      if (!el || el.contains(event.target as Node)) {
        return
      }

      // Click is outside, trigger handler
      handler(event)
    }

    // Listen for mouse and touch events
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    // Cleanup listeners
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Keyboard shortcut configuration
type KeyCombo = {
  key: string
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
}

// Hook to handle keyboard shortcuts with modifier keys
export function useKeyboardShortcut(keyCombo: KeyCombo, callback: () => void): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, shiftKey, altKey } = keyCombo

      // Check if key matches (case insensitive)
      const matchesKey = event.key.toLowerCase() === key.toLowerCase()
      // Check if all modifier keys match (undefined means any state)
      const matchesModifiers =
        (metaKey === undefined || event.metaKey === metaKey) &&
        (ctrlKey === undefined || event.ctrlKey === ctrlKey) &&
        (shiftKey === undefined || event.shiftKey === shiftKey) &&
        (altKey === undefined || event.altKey === altKey)

      // If both key and modifiers match, trigger callback
      if (matchesKey && matchesModifiers) {
        event.preventDefault()
        callback()
      }
    },
    [keyCombo, callback],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
