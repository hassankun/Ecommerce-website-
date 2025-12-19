import { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { dummyProducts } from "@/lib/dummy-data"
import { getProductBySlug as getProductFromStorage } from "@/app/api/products/_storage"
import ProductPageClient from "./ProductPageClient"

// Types
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount: number
  stock: number
  brand: string
  image: string
  images: string[]
  type: "wireless" | "gaming" | "anc"
  features: Record<string, any>
  colors: string[]
  in_stock: boolean
  seo_title: string | null
  seo_description: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[]
  created_at: string
  updated_at: string
}

interface Props {
  params: Promise<{ slug: string }>
}

// Fetch product by slug from Supabase with fallback to dummy data
async function getProductBySlug(slug: string): Promise<Product | null> {
  // Try Supabase first
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!error && data) {
    return data as Product
  }

  // Try in-memory storage for newly created products
  const storedProduct = getProductFromStorage(slug)
  if (storedProduct) {
    return storedProduct as any
  }

  // Fallback to dummy data
  const dummyProduct = dummyProducts.find(p => p.slug === slug)
  if (dummyProduct) {
    return dummyProduct as any
  }

  return null
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found | SonicPods",
      description: "The product you are looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonicpods.store"
  const productUrl = `${siteUrl}/products/${product.slug}`
  const productImage = product.image.startsWith("http")
    ? product.image
    : `${siteUrl}${product.image}`

  // Type labels for SEO
  const typeLabels: Record<string, string> = {
    wireless: "Wireless Earbuds",
    gaming: "Gaming Earbuds",
    anc: "ANC Earbuds",
  }
  const typeLabel = typeLabels[product.type] || "Earbuds"

  // Use AI-generated SEO data if available, otherwise fallback
  const metaTitle = product.meta_title || product.seo_title ||
    `${product.name} | ${typeLabel} | SonicPods`

  // Use AI-generated meta description if available
  let metaDescription: string
  if (product.meta_description || product.seo_description) {
    metaDescription = product.meta_description || product.seo_description || ""
  } else {
    const shortDescription = product.description.length > 120
      ? product.description.slice(0, 117) + "..."
      : product.description
    const finalPrice = product.discount > 0 ? product.price - product.discount : product.price
    metaDescription = `${product.name} - ${shortDescription} Only Rs. ${finalPrice.toLocaleString()}. Shop premium ${typeLabel.toLowerCase()} at SonicPods.`
  }

  // Use AI-generated keywords if available, otherwise fallback
  let keywords: string
  if (product.meta_keywords && product.meta_keywords.length > 0) {
    keywords = product.meta_keywords.join(", ")
  } else {
    const typeKeywords: Record<string, string[]> = {
      wireless: ["wireless earbuds", "TWS", "true wireless", "bluetooth earphones", "earbuds Pakistan"],
      gaming: ["gaming earbuds", "gaming headset", "low latency earbuds", "esports earphones", "gaming audio"],
      anc: ["ANC earbuds", "noise cancelling", "active noise cancellation", "noise cancelling earphones", "premium earbuds"],
    }
    keywords = [
      product.name,
      product.brand || "SonicPods",
      typeLabel,
      "premium earbuds",
      "buy online Pakistan",
      ...(typeKeywords[product.type] || []),
    ].join(", ")
  }

  return {
    title: metaTitle,
    description: metaDescription.slice(0, 160),
    keywords: keywords,
    authors: [{ name: "SonicPods" }],
    creator: "SonicPods",
    publisher: "SonicPods",
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
      url: productUrl,
      siteName: "SonicPods",
      title: product.name,
      description: metaDescription.slice(0, 160),
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: metaDescription.slice(0, 160),
      images: [productImage],
      creator: "@sonicpods",
      site: "@sonicpods",
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      "product:price:amount": (product.discount > 0 ? product.price - product.discount : product.price).toString(),
      "product:price:currency": "PKR",
      "product:availability": product.in_stock ? "in stock" : "out of stock",
      "product:category": product.type,
      "product:brand": product.brand || "SonicPods",
    },
  }
}

// Generate static params for popular products
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .limit(50)

  if (!products) return []

  return products.map((product) => ({
    slug: product.slug,
  }))
}

// Server component - fetches data on server
export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  // Fetch product by slug
  const product = await getProductBySlug(slug)

  // Return 404 if product not found
  if (!product) {
    notFound()
  }

  // JSON-LD structured data for rich snippets
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sonicpods.store"
  const productImage = product.image.startsWith("http")
    ? product.image
    : `${siteUrl}${product.image}`
  
  const finalPrice = product.discount > 0 ? product.price - product.discount : product.price

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImage,
    sku: product.id,
    mpn: product.id.slice(0, 8).toUpperCase(),
    brand: {
      "@type": "Brand",
      name: product.brand || "SonicPods",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "PKR",
      price: finalPrice,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "SonicPods",
      },
    },
    category: product.type,
    additionalProperty: product.features ? Object.entries(product.features).map(([name, value]) => ({
      "@type": "PropertyValue",
      name: name.replace(/_/g, ' '),
      value: typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value,
    })) : [],
  }

  // BreadcrumbList for SEO
  const typeLabels: Record<string, string> = {
    wireless: "Wireless",
    gaming: "Gaming",
    anc: "ANC",
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/collection`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: typeLabels[product.type] || "Earbuds",
        item: `${siteUrl}/collection?type=${product.type}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD Structured Data for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* JSON-LD Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  )
}
