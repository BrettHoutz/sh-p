'use client'

import { setMedium, setDemoMode, setPromo, setOrange } from '@/lib/flags/actions'
import type { Medium } from '@/types'
import SlideOver from '@/components/slide-over'
import { useState } from 'react'
import { useKeyboardShortcut } from '@/lib/hooks/client'
import { useRouter } from 'next/navigation'

// Props for the secret menu component
type KeyboardShortcutsProps = {
  medium: Medium
  showDemoMode?: boolean
  showPromo?: boolean
  showOrange?: boolean
}

// Secret menu for toggling app flags/settings via keyboard shortcut
export default function KeyboardShortcuts({
  medium,
  showDemoMode = false,
  showPromo = false,
  showOrange = false,
}: KeyboardShortcutsProps) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const router = useRouter()

  // Open/close menu with Cmd+Shift+M
  useKeyboardShortcut({ key: 'm', metaKey: true, shiftKey: true }, () => setIsSlideOverOpen(!isSlideOverOpen))

  // Toggle demo mode and refresh
  async function handleSetDemoMode(value: boolean) {
    await setDemoMode(value)
    router.refresh()
  }

  // Set traffic medium and refresh
  async function handleSetMedium(value: Medium) {
    await setMedium(value)
    router.refresh()
  }

  // Toggle orange CTA and refresh
  async function handleSetOrange(value: boolean) {
    await setOrange(value)
    router.refresh()
  }

  // Toggle promo display and refresh
  async function handleSetPromo(value: boolean) {
    await setPromo(value)
    router.refresh()
  }

  return (
    <SlideOver isOpen={isSlideOverOpen} onCloseAction={() => setIsSlideOverOpen(false)} direction="right">
      <div className="flex flex-col gap-y-8 p-4">
        {/* Demo Mode toggle */}
        <ul>
          <li>Demo Mode</li>
          <li className="flex gap-x-4">
            <button
              onClick={() => handleSetDemoMode(true)}
              className={`text-[yellow] ${showDemoMode ? 'underline underline-offset-8' : ''}`}
            >
              true
            </button>
            <button
              onClick={() => handleSetDemoMode(false)}
              className={`text-[yellow] ${!showDemoMode ? 'underline underline-offset-8' : ''}`}
            >
              false
            </button>
          </li>
        </ul>

        {/* Traffic medium selector */}
        <ul>
          <li>Medium</li>
          <li className="flex gap-x-4">
            <button
              onClick={() => handleSetMedium('organic')}
              className={`text-[yellow] ${medium === 'organic' ? 'underline underline-offset-8' : ''}`}
            >
              organic
            </button>
            <button
              onClick={() => handleSetMedium('paid')}
              className={`text-[yellow] ${medium === 'paid' ? 'underline underline-offset-8' : ''}`}
            >
              paid
            </button>
          </li>
        </ul>

        {/* Promo display toggle */}
        <ul>
          <li>Show Promo</li>
          <li className="flex gap-x-4">
            <button
              onClick={() => handleSetPromo(true)}
              className={`text-[yellow] ${showPromo ? 'underline underline-offset-8' : ''}`}
            >
              true
            </button>
            <button
              onClick={() => handleSetPromo(false)}
              className={`text-[yellow] ${!showPromo ? 'underline underline-offset-8' : ''}`}
            >
              false
            </button>
          </li>
        </ul>

        {/* Orange CTA toggle */}
        <ul>
          <li>Orange CTA</li>
          <li className="flex gap-x-4">
            <button
              onClick={() => handleSetOrange(true)}
              className={`text-[yellow] ${showOrange ? 'underline underline-offset-8' : ''}`}
            >
              true
            </button>
            <button
              onClick={() => handleSetOrange(false)}
              className={`text-[yellow] ${!showOrange ? 'underline underline-offset-8' : ''}`}
            >
              false
            </button>
          </li>
        </ul>
      </div>
    </SlideOver>
  )
}
