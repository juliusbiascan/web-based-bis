import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  weight: ['400', '700'], // Specify desired weights
  subsets: ['latin'],
  variable: '--font-poppins', // Optional: define a CSS variable
  display: 'swap', // Optional: control font loading behavior
});


export const metadata: Metadata = {
  metadataBase: new URL('https://macatiw-ebarangay.gov.ph'),
  title: {
    default: "Macatiw eBarangay - Web-Based Barangay Information System",
    template: "%s | Macatiw eBarangay"
  },
  description: "Empowering Barangay Macatiw through digital innovation. An efficient, secure, and user-friendly platform for residents and barangay officials to manage community services, requests, and records in one place.",
  keywords: [
    "Macatiw eBarangay",
    "barangay information system",
    "web-based barangay system",
    "Barangay Macatiw",
    "eBarangay platform",
    "digital barangay services",
    "community management system",
    "barangay document requests",
    "local governance platform",
    "Philippine barangay system",
    "resident portal",
    "barangay clearance online",
    "certificate of indigency",
    "barangay ID application",
    "community records management",
    "secure barangay platform",
    "digital community services",
    "barangay transparency",
    "local government innovation",
    "resident assistance system"
  ],
  authors: [
    { name: "Macatiw eBarangay Development Team" },
    { name: "CSS (Computer Systems & Solutions)" },
    { name: "PASS (Professional and Administrative Support Services)" }
  ],
  creator: "Macatiw eBarangay Development Team",
  publisher: "Barangay Macatiw",
  applicationName: "Macatiw eBarangay",
  category: "Government Services",
  classification: "Local Government Unit System",
  openGraph: {
    title: "Macatiw eBarangay - Web-Based Barangay Information System",
    description: "Empowering Barangay Macatiw through digital innovation. Efficient, secure, and user-friendly platform for community services and records management.",
    url: "https://macatiw-ebarangay.gov.ph",
    siteName: "Macatiw eBarangay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Macatiw eBarangay - Digital Community Services Platform",
      },
    ],
    locale: "en_PH",
    type: "website",
    countryName: "Philippines",
  },
  twitter: {
    card: "summary_large_image",
    title: "Macatiw eBarangay - Web-Based Barangay Information System",
    description: "Empowering Barangay Macatiw through digital innovation with efficient and secure community services.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },
  verification: {
    // Add your verification tokens when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: "https://macatiw-ebarangay.gov.ph",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  return (
    <SessionProvider session={session} key={session?.user.id}>
      <html lang="en">
        <body
          className={`${poppins.className} antialiased`}
        >
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <Toaster />
          {children}
        </body>
      </html>
    </SessionProvider>

  );
}
