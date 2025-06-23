import '@/app/globals.css'
import type { CSSProperties, ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { getRootParams } from '@/lib/flags/server'
import Footer from '@/components/footer'
import LanguageLocaleSelector from '@/components/language-locale-selector'
import type { Metadata } from 'next'
import Nav from '@/components/nav'
import { parseRoot } from '@/lib/flags/server'
import Promo from '@/components/promo'
import SecretMenu from '@/components/secret-menu'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Configure Google Fonts with CSS variables for consistent typography
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans', // CSS variable for the main sans-serif font
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono', // CSS variable for monospace font (used sparingly)
})

/**
 * Generate static params for all possible root combinations
 * This enables static generation at build time for better performance
 * Root params include language, locale, and feature flag combinations
 */
export async function generateStaticParams() {
  return await getRootParams()
}

/**
 * Global metadata configuration for the application
 * Sets up the base title and template for all pages
 */
export const metadata: Metadata = {
  title: {
    default: 'Ship/Shop', // Default title when no page-specific title is set
    template: '%s | Ship/Shop', // Template for page titles (e.g., "Product Name | Ship/Shop")
  },
}

/**
 * Root layout component that wraps all pages in the application
 *
 * Features:
 * - Feature flag integration for dynamic behavior
 * - Internationalization support
 * - Dynamic styling based on A/B tests
 * - Consistent typography and brutalist design
 * - Analytics and performance monitoring
 * - Conditional promotional content
 */
export default async function Layout({ children }: { children: ReactNode }) {
  // Parse root parameters including language, locale, and feature flags
  const { lang, locale, medium, showDemoMode, showPromo, showOrange } = await parseRoot()

  return (
    <html lang={`${lang}-${locale.toUpperCase()}`}>
      <body
        // Apply font variables and brutalist styling classes
        className={`${geistSans.variable} ${geistMono.variable} bg-[black] font-sans text-2xl text-[white] antialiased lg:text-6xl lg:font-light lg:tracking-tight`}
        style={
          {
            // Dynamic CSS custom property for A/B testing CTA button colors
            '--color-add-to-cart': showOrange ? 'orange' : 'magenta',
          } as CSSProperties
        }
      >
        {/* Conditional promotional banner based on feature flag */}
        {showPromo && <Promo lang={lang} />}

        {/* Main navigation with internationalization */}
        <Nav lang={lang} />

        {/* Main content area with consistent spacing */}
        <main className="grid grid-cols-1 gap-y-8 p-4">{children}</main>

        {/* Language and locale selector for internationalization */}
        <LanguageLocaleSelector lang={lang} locale={locale} />

        {/* Footer with internationalized content */}
        <Footer lang={lang} />

        {/* Developer/admin menu with feature flag controls */}
        <SecretMenu medium={medium} showDemoMode={showDemoMode} showPromo={showPromo} showOrange={showOrange} />

        {/* Vercel Analytics for user behavior tracking */}
        <Analytics />

        {/* Vercel Speed Insights for performance monitoring */}
        <SpeedInsights />
      </body>
    </html>
  )
}
