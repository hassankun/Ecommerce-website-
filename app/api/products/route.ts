import { supabase } from "@/lib/supabase"
import { generateSlug } from "@/lib/slug"
import { generateProductSEO } from "@/lib/groq"
import { dummyProducts } from "@/lib/dummy-data"
import { addProduct, filterProducts, getAllProducts } from "./_storage"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const slug = searchParams.get("slug")
    const brand = searchParams.get("brand")
    const featured = searchParams.get("featured")

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }
    
    if (category) {
      if (['wireless', 'gaming', 'anc', 'budget', 'premium'].includes(category)) {
        if (category === 'budget') {
          query = query.lte('price', 10000)
        } else if (category === 'premium') {
          query = query.gte('price', 15000)
        } else {
          query = query.eq('type', category)
        }
      } else {
        query = query.eq('category_id', category)
      }
    }
    
    if (slug) {
      query = query.eq('slug', slug)
    }
    
    if (brand) {
      query = query.ilike('brand', `%${brand}%`)
    }
    
    if (featured === 'true') {
      query = query.gt('discount', 0).limit(8)
    }

    const { data: products, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[SonicPods] Error fetching products from Supabase, falling back to dummy data:", error)
    
    // Re-extract query parameters since we're in catch block
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const slug = searchParams.get("slug")
    const brand = searchParams.get("brand")
    const featured = searchParams.get("featured")
    
    // Fallback to dummy data + created products for development
    const createdProducts = getAllProducts()
    let products = [...dummyProducts, ...createdProducts]

    // Apply basic filtering to dummy data
    if (type) {
      products = products.filter(p => p.type === type)
    }
    if (category) {
      if (category === 'budget') {
        products = products.filter(p => p.price <= 10000)
      } else if (category === 'premium') {
        products = products.filter(p => p.price >= 15000)
      } else if (['wireless', 'gaming', 'anc'].includes(category)) {
        products = products.filter(p => p.type === category)
      }
    }
    if (slug) {
      products = products.filter(p => p.slug === slug)
    }
    if (brand) {
      products = products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()))
    }
    if (featured === 'true') {
      products = products.filter(p => p.discount > 0).slice(0, 8)
    }

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products.length,
        fallback: true,
      },
      { status: 200 },
    )
  }
}

/**
 * Generate a unique slug for a product
 */
async function generateUniqueProductSlug(name: string, excludeId?: string, customSlug?: string): Promise<string> {
  const baseSlug = customSlug || generateSlug(name)
  
  let query = supabase
    .from('products')
    .select('slug')
    .eq('slug', baseSlug)
  
  if (excludeId) {
    query = query.neq('id', excludeId)
  }
  
  const { data: existing } = await query.maybeSingle()
  
  if (!existing) {
    return baseSlug
  }
  
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`
  
  while (true) {
    let checkQuery = supabase
      .from('products')
      .select('slug')
      .eq('slug', newSlug)
    
    if (excludeId) {
      checkQuery = checkQuery.neq('id', excludeId)
    }
    
    const { data: existingWithCounter } = await checkQuery.maybeSingle()
    
    if (!existingWithCounter) {
      return newSlug
    }
    
    counter++
    newSlug = `${baseSlug}-${counter}`
  }
}

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()
    
    // Generate comprehensive SEO content using Groq AI (Llama 3.3)
    console.log("🎧 Generating SEO content for SonicPods product...")
    const seoData = await generateProductSEO({
      name: body.name,
      description: body.description,
      price: body.price,
      type: body.type,
      brand: body.brand || 'SonicPods',
      features: body.features,
    })
    
    // Generate unique slug (prefer AI-generated, fallback to name-based)
    const baseSlug = seoData?.seoSlug || generateSlug(body.name)
    const slug = await generateUniqueProductSlug(body.name, undefined, baseSlug)
    
    // Use AI-generated description if user didn't provide one
    const description = body.description || seoData?.productDescription || ""
    
    // Prepare images array
    const images = body.images || (body.image ? [body.image] : [])
    
    const productData = {
      // Basic Info
      name: body.name,
      slug,
      description: description,
      price: body.price,
      discount: body.discount || 0,
      stock: body.stock || 0,
      brand: body.brand || 'SonicPods',
      type: body.type || 'wireless',
      category_id: body.category_id || null,
      features: body.features || {},
      images: images,
      image: body.image || (images.length > 0 ? images[0] : null),
      colors: body.colors || ['Black'],
      in_stock: body.in_stock !== undefined ? body.in_stock : true,
      
      // Meta Tags (SEO)
      meta_title: seoData?.metaTitle || null,
      meta_description: seoData?.metaDescription || null,
      meta_keywords: seoData?.metaKeywords || [],
      
      // OpenGraph Tags
      og_title: seoData?.ogTitle || null,
      og_description: seoData?.ogDescription || null,
      og_type: seoData?.ogType || 'product',
      
      // Twitter Card
      twitter_title: seoData?.twitterTitle || null,
      twitter_description: seoData?.twitterDescription || null,
      
      // SEO Content
      seo_title: seoData?.seoTitle || null,
      seo_description: seoData?.seoDescription || null,
      
      // Schema.org
      schema_description: seoData?.schemaDescription || null,
    }

    console.log("📦 Creating product with SEO:", {
      name: productData.name,
      slug: productData.slug,
      type: productData.type,
      price: productData.price,
      seo_generated: !!seoData,
      meta_title: productData.meta_title?.slice(0, 40) + "...",
    })

    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
        seoGenerated: !!seoData,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[SonicPods] Error creating product:", error)
    
    // Fallback: Store product in memory for development
    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
        },
        { status: 400 },
      )
    }
    
    try {
      // Generate SEO data
      const seoData = await generateProductSEO({
        name: body.name,
        description: body.description,
        price: body.price,
        type: body.type,
        brand: body.brand || 'SonicPods',
        features: body.features,
      })
      
      const baseSlug = seoData?.seoSlug || generateSlug(body.name)
      let counter = 1
      let slug = baseSlug
      const createdProducts = getAllProducts()
      while (createdProducts.some(p => p.slug === slug) || dummyProducts.some(p => p.slug === slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      
      const images = body.images || (body.image ? [body.image] : [])
      
      const newProduct = {
        id: `prod_${Date.now()}`,
        name: body.name,
        slug,
        description: body.description || seoData?.productDescription || "Premium earpods for audio enthusiasts.",
        price: body.price,
        discount: body.discount || 0,
        stock: body.stock || 0,
        brand: body.brand || 'SonicPods',
        type: body.type || 'wireless',
        category_id: body.category_id || null,
        features: body.features || {},
        images: images,
        image: body.image || (images.length > 0 ? images[0] : null),
        colors: body.colors || ['Black'],
        in_stock: body.in_stock !== undefined ? body.in_stock : true,
        meta_title: seoData?.metaTitle || null,
        meta_description: seoData?.metaDescription || null,
        meta_keywords: seoData?.metaKeywords || [],
        og_title: seoData?.ogTitle || null,
        og_description: seoData?.ogDescription || null,
        og_type: seoData?.ogType || 'product',
        twitter_title: seoData?.twitterTitle || null,
        twitter_description: seoData?.twitterDescription || null,
        seo_title: seoData?.seoTitle || null,
        seo_description: seoData?.seoDescription || null,
        schema_description: seoData?.schemaDescription || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      addProduct(newProduct)
      console.log("✅ Product created in fallback memory storage")
      
      return NextResponse.json(
        {
          success: true,
          data: newProduct,
          seoGenerated: !!seoData,
          fallback: true,
        },
        { status: 201 },
      )
    } catch (fallbackError) {
      console.error("[SonicPods] Fallback error:", fallbackError)
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create product",
        },
        { status: 500 },
      )
    }
  }
}
