/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'], // Add any other domains you load images from
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript checking during build
  },
  output: 'standalone',
  
  // Ensure CSS is handled correctly
  optimizeFonts: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Add redirects for pages that might exist in Google's index
  async redirects() {
    return [
      // Redirects for common URL patterns that might exist in old site
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/faq.html',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/blog.html',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/schools',
        destination: '/browse',
        permanent: true,
      },
      // Add more redirects as needed
    ]
  },
  
  // Ensure production-focused asset optimization - but remove problematic features
  experimental: {
    // Remove optimizeCss that's causing the 'critters' dependency issue
    optimizePackageImports: ['lucide-react'],
  },
  
  // Generate a static export for better CSS handling
  trailingSlash: true,
}

module.exports = nextConfig 