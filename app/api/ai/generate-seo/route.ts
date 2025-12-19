import { generateProductSEO } from "@/lib/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, price, brand, description, features } = body

    if (!name || !type || !price) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, type, and price are required",
        },
        { status: 400 },
      )
    }

    console.log("🤖 Generating SEO content for:", name)

    const seoData = await generateProductSEO({
      name,
      type,
      price,
      brand: brand || "SonicPods",
      description: description || "",
      features: features || {},
    })

    if (!seoData) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate SEO content",
        },
        { status: 500 },
      )
    }

    // Format the response
    const formattedSEO = {
      meta_title: seoData.metaTitle,
      meta_description: seoData.metaDescription,
      meta_keywords: seoData.metaKeywords.join(", "),
      og_title: seoData.ogTitle,
      og_description: seoData.ogDescription,
      twitter_title: seoData.twitterTitle,
      twitter_description: seoData.twitterDescription,
      seo_title: seoData.seoTitle,
      seo_description: seoData.seoDescription,
      productDescription: seoData.productDescription,
    }

    console.log("✅ SEO content generated successfully!")

    return NextResponse.json(
      {
        success: true,
        seo: formattedSEO,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[SonicPods] Error generating SEO:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate SEO content",
      },
      { status: 500 },
    )
  }
}

