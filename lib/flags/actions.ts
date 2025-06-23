'use server'

import { cookies } from 'next/headers'
import { COOKIE_CONFIG } from '../util/server'
import type { Medium } from '@/types'

/**
 * Sets the medium preference in cookies
 * @param value - The medium type to store
 */
export async function setMedium(value: Medium) {
  const cookieStore = await cookies()
  cookieStore.set('medium', value)
}

/**
 * Toggles the demo mode display preference
 * @param value - Boolean indicating whether to show demo mode
 */
export async function setDemoMode(value: boolean) {
  const cookieStore = await cookies()
  cookieStore.set('show-demo-mode', String(value), COOKIE_CONFIG)
}

/**
 * Toggles the promotional content display preference
 * @param value - Boolean indicating whether to show promotional content
 */
export async function setPromo(value: boolean) {
  const cookieStore = await cookies()
  cookieStore.set('show-promo', String(value), COOKIE_CONFIG)
}

/**
 * Toggles the orange theme/styling preference
 * @param value - Boolean indicating whether to show orange styling
 */
export async function setOrange(value: boolean) {
  const cookieStore = await cookies()
  cookieStore.set('show-orange', String(value), COOKIE_CONFIG)
}
