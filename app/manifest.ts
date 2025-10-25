import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Macatiw eBarangay - Web-Based Barangay Information System',
    short_name: 'Macatiw eBarangay',
    description: 'Empowering Barangay Macatiw through digital innovation. An efficient, secure, and user-friendly platform for residents and barangay officials to manage community services, requests, and records in one place.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}