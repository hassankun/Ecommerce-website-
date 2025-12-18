import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: categories,
        count: categories?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[SonicPods] Error fetching categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch categories",
      },
      { status: 500 },
    )
  }
}

