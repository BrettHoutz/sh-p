import { type NextRequest, NextResponse, userAgent } from 'next/server'
import { flags } from './lib/flags/server'
import { isbot } from 'isbot'
import { precompute } from 'flags/next'

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .well-known (well-known URIs)
     * - public files (images, assets, etc.)
     */
    {
      missing: [{ type: 'header', key: 'purpose', value: 'prefetch' }],
      source: '/((?!api|_next/static|_next/image|favicon.ico|.well-known|.*\\..*$).*)',
    },
  ],
}

// Regex to match valid paths
const VALID_PATHS_REGEX = /^(\/|\/cart\/.*|\/collections(\/.*)?|\/products\/.*)$/

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Detect if the request is coming from a bot based on user agent
  const isBot = isbot(userAgent(request).ua)

  // Set a header to indicate if we should skip flag computing
  // We skip if the request is from a bot or if the path is not valid
  request.headers.set('x-bail', String([!VALID_PATHS_REGEX.test(request.nextUrl.pathname), isBot].includes(true)))

  // Make the utm_medium available to flag decisions
  request.headers.set('x-utm-medium', request.nextUrl.searchParams.get('utm_medium') ?? '')

  // Precompute flags
  const root = await precompute(flags)

  // Add the variantId and utm_medium to the pathname if they exist
  if (url.pathname.startsWith('/products')) {
    url.pathname = `${url.pathname}/${request.nextUrl.searchParams.get('variantId') ?? 'undefined'}`
  }

  // Add the precomputed root to the pathname
  url.pathname = `/${root}${url.pathname}`

  // Rewrite the request to the new pathname
  const response = NextResponse.rewrite(url)

  // Add the resolved url to the response headers
  response.headers.set('x-resolved-url', request.nextUrl.toString())

  // Return the response
  return response
}
