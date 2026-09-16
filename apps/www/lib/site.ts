export const siteConfig = {
  name: "Fujin",
  url: "https://fujin.dev",
  registryUrl: "https://fujin.dev/r",
  description:
    "Production-ready React components you own. Full data tables, full forms, full features - not primitives you have to assemble.",
  tagline: "Components that are already finished.",
  links: {
    github: "https://github.com/ashfaqaxe-stack/fujin",
  },
} as const

export type SiteConfig = typeof siteConfig
