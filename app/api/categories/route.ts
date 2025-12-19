import { supabase } from "@/lib/supabase"
import { productCategories } from "@/lib/dummy-data"
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
    console.error("[SonicPods] Error fetching categories from Supabase, falling back to dummy data:", error)
    return NextResponse.json(
      {
        success: true,
        data: productCategories,
        count: productCategories.length,
        fallback: true,
      },
      { status: 200 },
    )
  }
}

