import { supabase } from "@/lib/supabase"
import { dummyProducts } from "@/lib/dummy-data"
import { redirect, notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

// Check if string is UUID
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

// This page redirects old /product/[id] URLs to new /products/[slug] URLs
// This preserves SEO value with 308 (permanent) redirect
export default async function OldProductRedirect({ params }: Props) {
  const { id } = await params
  
  // Fetch product to get slug - try Supabase first
  let query = supabase.from("products").select("slug")
  
  if (isUUID(id)) {
    query = query.eq("id", id)
  } else {
    // Treat as slug - redirect to new URL format
    query = query.eq("slug", id)
  }
  
  const { data: product, error } = await query.single()
  
  if (!error && product && product.slug) {
    // 308 Permanent Redirect to new SEO-friendly URL
    redirect(`/products/${product.slug}`)
  }
  
  // Fallback to dummy data
  if (isUUID(id)) {
    const dummyProduct = dummyProducts.find(p => p.id === id)
    if (dummyProduct) {
      redirect(`/products/${dummyProduct.slug}`)
    }
  } else {
    const dummyProduct = dummyProducts.find(p => p.slug === id)
    if (dummyProduct) {
      redirect(`/products/${dummyProduct.slug}`)
    }
  }
  
  notFound()
}
