import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Outfit, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/context/cart-context"
import "./globals.css"

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
})

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-display",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonicpods.store"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0891b2" },
    { media: "(prefers-color-scheme: dark)", color: "#06b6d4" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SonicPods | Premium Wireless Earbuds & Audio Gear",
    template: "%s | SonicPods",
  },
  description:
    "Experience premium sound quality with SonicPods. Shop the finest wireless earbuds, gaming headsets, and ANC earphones. Free shipping on orders over Rs. 10,000. 100% authentic products with warranty.",
  keywords: [
    "SonicPods",
    "wireless earbuds Pakistan",
    "TWS earphones",
    "true wireless earbuds",
    "gaming earbuds",
    "ANC earbuds",
    "noise cancelling earphones",
    "Bluetooth earbuds",
    "premium earbuds",
    "bass earphones",
    "sports earbuds",
    "audiophile earbuds",
    "budget earbuds Pakistan",
    "best earbuds 2024",
    "wireless headphones",
    "audio gear Pakistan",
  ],
  authors: [{ name: "SonicPods", url: siteUrl }],
  creator: "SonicPods",
  publisher: "SonicPods",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SonicPods",
    title: "SonicPods | Premium Wireless Earbuds & Audio Gear",
    description:
      "Experience premium sound quality with SonicPods. Shop the finest wireless earbuds, gaming headsets, and ANC earphones.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "SonicPods - Premium Wireless Earbuds",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SonicPods | Premium Wireless Earbuds & Audio Gear",
    description:
      "Experience premium sound quality with SonicPods. Shop the finest wireless earbuds, gaming headsets, and ANC earphones.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@sonicpods",
    site: "@sonicpods",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Electronics & Audio",
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  other: {
    "msapplication-TileColor": "#06b6d4",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "SonicPods",
  },
}

// JSON-LD Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SonicPods",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "Premium wireless earbuds and audio gear store",
  sameAs: [
    "https://facebook.com/sonicpods",
    "https://instagram.com/sonicpods",
    "https://twitter.com/sonicpods",
    "https://youtube.com/sonicpods",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-300-1234567",
    contactType: "customer service",
    availableLanguage: ["English", "Urdu"],
    areaServed: "PK",
  },
}

// JSON-LD WebSite Schema for Sitelinks Search Box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SonicPods",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/collection?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

// JSON-LD Store Schema
const storeSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "SonicPods",
  url: siteUrl,
  image: `${siteUrl}/store-image.jpg`,
  priceRange: "₨₨",
  servesCuisine: "Electronics",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tech Plaza, Main Boulevard",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    postalCode: "54000",
    addressCountry: "PK",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.5204,
    longitude: 74.3587,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "12:00",
      closes: "20:00",
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${outfit.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
