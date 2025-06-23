import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const COOKIE_CONFIG: Partial<ResponseCookie> = {
  httpOnly: true,
  maxAge: 2 * 365 * 24 * 60 * 60,
  secure: true,
}
