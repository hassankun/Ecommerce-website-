import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Default admin credentials for development
const DEFAULT_ADMIN = {
  email: "admin@sonicpods.com",
  password: "admin123",
  id: "default-admin",
  name: "Admin User",
  role: "admin",
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // First try to get admin from Supabase
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    let adminUser = admin

    // If not found in Supabase, try default admin credentials
    if (error || !admin) {
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        adminUser = DEFAULT_ADMIN
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid email or password",
          },
          { status: 401 },
        )
      }
    } else {
      // Admin found in Supabase, verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password)

      if (!isPasswordValid) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid email or password",
          },
          { status: 401 },
        )
      }
    }

    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          admin: {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to login",
      },
      { status: 500 },
    )
  }
}
