import { type ApiData, version } from 'flags'
import { NextResponse } from 'next/server'

/**
 * Vercel Flags API endpoint that defines available feature flags for the application
 *
 * This endpoint is automatically discovered by Vercel's flags system and provides
 * metadata about available flags including their descriptions and possible values.
 *
 * The .well-known/vercel/flags path is a standard convention used by Vercel
 * for feature flag discovery and management.
 */
export async function GET() {
  return NextResponse.json<ApiData>(
    {
      definitions: {
        // Traffic source/medium flag - determines how the user arrived at the site
        medium: {
          description: 'The medium of the user',
          options: [
            { value: 'organic' }, // User arrived through organic search/direct traffic
            { value: 'paid' }, // User arrived through paid advertising
            { value: 'social' }, // User arrived through social media links
          ],
        },
        // UI styling flag - controls call-to-action button color
        'show-orange': {
          description: 'Change the CTA color to orange',
          // Boolean flag (no options defined = true/false toggle)
        },
        // Marketing flag - controls promotional banner visibility
        'show-promo': {
          description: 'Show the promo banner',
          // Boolean flag (no options defined = true/false toggle)
        },
      },
    },
    {
      // Include the flags SDK version in response headers for compatibility tracking
      headers: { 'x-flags-sdk-version': version },
    },
  )
}
