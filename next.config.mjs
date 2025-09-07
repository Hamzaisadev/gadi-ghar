import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
})({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', 
      },
      {
        protocol: 'https',
        hostname: 'ilmkrxcimwdjjvrzxlkd.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Allow Clerk + CAPTCHA providers
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.dev https://*.clerkstage.dev https://*.clerk.services https://*.clerk.accounts.dev https://*.supabase.co https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://source.unsplash.com https://images.unsplash.com https://img.clerk.com https://ilmkrxcimwdjjvrzxlkd.supabase.co https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.clerk.com https://*.clerk.dev https://*.clerkstage.dev https://*.clerk.services https://*.clerk.accounts.dev https://*.supabase.co https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com",
              "frame-src 'self' https://www.youtube.com https://*.clerk.com https://*.clerk.dev https://*.clerkstage.dev https://*.clerk.services https://*.clerk.accounts.dev https://challenges.cloudflare.com https://hcaptcha.com https://*.hcaptcha.com",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.youtube.com",
          },
        ],
      },
    ];
  },
});

export default nextConfig;
