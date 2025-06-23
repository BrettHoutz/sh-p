import { cookies as nextCookies } from 'next/headers'
import { type NextRequest } from 'next/server'

// API route to reset all app cookies and redirect to home
export async function GET(req: NextRequest) {
  const cookies = await nextCookies()

  // Delete all app-specific cookies
  for (const cookie of [
    'cart',
    'lang',
    'locale',
    'medium',
    'recent-purchase',
    'show-demo-mode',
    'show-orange',
    'show-promo',
  ]) {
    cookies.delete(cookie)
  }

  // Redirect to home page
  req.nextUrl.pathname = '/'
  return Response.redirect(req.nextUrl.toString())
}
