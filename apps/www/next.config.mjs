import { fileURLToPath } from "node:url"
import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  typedRoutes: true,
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)),
  async rewrites() {
    return [
      // LLM-readable markdown for every docs page: /docs/x.md -> raw markdown.
      { source: "/docs/:path*.md", destination: "/llm/:path*" },
      // Registry index aliases so `@fujin` resolves with or without the suffix.
      { source: "/r/registry", destination: "/r/registry.json" },
    ]
  },
  async redirects() {
    return [
      {
        source: "/docs/components",
        destination: "/docs/components/button",
        permanent: false,
      },
    ]
  },
}

export default withMDX(config)
