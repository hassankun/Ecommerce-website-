import { generateProductDescription } from "@/lib/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, category, briefInfo } = body

    if (!name || !type) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and type are required",
        },
        { status: 400 },
      )
    }

    console.log("🤖 Generating description for:", name)

    const description = await generateProductDescription(
      name,
      type,
      category || "earbuds",
      briefInfo
    )

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate description.",
        },
        { status: 500 },
      )
    }

    console.log("✅ Description generated successfully!")

    return NextResponse.json(
      {
        success: true,
        description,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[SonicPods] Error generating description:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate description",
      },
      { status: 500 },
    )
  }
}
