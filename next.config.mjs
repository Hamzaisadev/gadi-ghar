/** @type {import('next').NextConfig} */
const nextConfig = {
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
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://www.youtube.com", // Use single quotes, not backticks
          },
        ],
      },
    ];
  },
};

export default nextConfig;
