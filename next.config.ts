import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    // TODO: Comment
    ppr: true,
    reactCompiler: true,
    // TODO: Comment
    useCache: true,
  },
}

export default nextConfig
