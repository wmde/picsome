import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
const path = require("path")

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "picsome",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["de_DE", "en"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "de_DE",
    localeDetection: false,
  },
  images: {
    domains: [
      "upload.wikimedia.org",
      "live.staticflickr.com",
      "api.creativecommons.engineering",
      "api.openverse.engineering",
    ],
    // `deviceSizes` - Use Blitz defaults
    imageSizes: [32, 600, 1024, 2048],
    minimumCacheTTL: 86400, // 1 day
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
  loading: {
    color: "#3A25FF",
    height: "50px",
  },
  headers: async () => [
    {
      // Apply these headers to all routes in our application.
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
}
const securityHeaders = [
  // {
  //   key: "Content-Security-Policy",
  //   value:
  //     "default-src 'self' wikidata.org *.wikidata.org fonts.googleapis.com widget.usersnap.com stats.wikimedia.de;",
  // },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
]
module.exports = config
