import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import { addOrder, getAllOrders } from "./_storage"

export async function GET(request: NextRequest) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: orders,
        count: orders?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[SonicPods] Error fetching orders from Supabase, using fallback:", error)
    
    // Return orders from memory storage
    return NextResponse.json(
      {
        success: true,
        data: getAllOrders(),
        count: getAllOrders().length,
        fallback: true,
      },
      { status: 200 },
    )
  }
}

export async function POST(request: NextRequest) {
  let body: any
  try {
    body = await request.json()

    const { data: order, error } = await supabase
      .from('orders')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[SonicPods] Error creating order:", error)
    
    // Fallback: Store order in memory for development
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
      const newOrder = {
        id: `order_${Date.now()}`,
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      addOrder(newOrder)
      console.log("✅ Order created in fallback memory storage:")
      console.log("   ID:", newOrder.id)
      console.log("   Customer:", newOrder.customer_name)
      console.log("   Email:", newOrder.email)
      
      return NextResponse.json(
        {
          success: true,
          data: newOrder,
          fallback: true,
        },
        { status: 201 },
      )
    } catch (fallbackError) {
      console.error("[SonicPods] Fallback error creating order:", fallbackError)
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create order",
        },
        { status: 500 },
      )
    }
  }
}

// Export for use by track endpoint
export { createdOrders }
