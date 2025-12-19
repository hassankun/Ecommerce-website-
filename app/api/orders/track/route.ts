import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import { getOrder, getOrderByEmail } from "../_storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const email = searchParams.get("email")

    if (!orderId && !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID or Email is required",
        },
        { status: 400 },
      )
    }

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (orderId) {
      query = query.eq('id', orderId)
    }

    if (email) {
      query = query.eq('email', email)
    }

    const { data: orders, error } = await query

    if (error) {
      throw error
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // If searching by email, return the most recent order
    const order = orders[0]

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[SonicPods] Error tracking order from Supabase, using fallback:", error)
    
    // Fallback: Search in development orders
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const email = searchParams.get("email")

    console.log("[SonicPods] Fallback search - orderId:", orderId, "email:", email)

    if (!orderId && !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID or Email is required",
        },
        { status: 400 },
      )
    }

    let foundOrder = null
    if (orderId) {
      foundOrder = getOrder(orderId)
      console.log("[SonicPods] Looking for orderId:", orderId, "Found:", foundOrder ? "YES" : "NO")
    } else if (email) {
      // Search through all orders for matching email
      foundOrder = getOrderByEmail(email)
      console.log("[SonicPods] Looking for email:", email, "Found:", foundOrder ? "YES" : "NO")
    }

    if (!foundOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: foundOrder,
        fallback: true,
      },
      { status: 200 },
    )
  }
}
