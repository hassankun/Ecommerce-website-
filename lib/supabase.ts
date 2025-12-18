import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if environment variables are properly set
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.error('⚠️  Supabase environment variables are not set!')
  console.error('Please create a .env.local file with your Supabase credentials.')
  console.error('Required variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for SonicPods Earpods Store
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          discount: number
          stock: number
          brand: string
          category_id: string | null
          type: 'wireless' | 'gaming' | 'anc'
          features: Record<string, any>
          images: string[]
          image: string
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
        Insert: {
          id?: string
          name: string
          slug?: string
          description: string
          price: number
          discount?: number
          stock?: number
          brand?: string
          category_id?: string | null
          type: 'wireless' | 'gaming' | 'anc'
          features?: Record<string, any>
          images?: string[]
          image: string
          colors?: string[]
          in_stock?: boolean
          seo_title?: string | null
          seo_description?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          discount?: number
          stock?: number
          brand?: string
          category_id?: string | null
          type?: 'wireless' | 'gaming' | 'anc'
          features?: Record<string, any>
          images?: string[]
          image?: string
          colors?: string[]
          in_stock?: boolean
          seo_title?: string | null
          seo_description?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          customer_name: string
          email: string
          phone: string
          address: string
          city: string | null
          postal_code: string | null
          items: {
            product_id: string
            product_name: string
            quantity: number
            price: number
          }[]
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          customer_name: string
          email: string
          phone: string
          address: string
          city?: string | null
          postal_code?: string | null
          items: {
            product_id: string
            product_name: string
            quantity: number
            price: number
          }[]
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          customer_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string | null
          postal_code?: string | null
          items?: {
            product_id: string
            product_name: string
            quantity: number
            price: number
          }[]
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          message: string
          status: 'new' | 'read' | 'replied'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'new' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'new' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          password: string
          name: string | null
          role: 'admin' | 'superadmin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name?: string | null
          role?: 'admin' | 'superadmin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string | null
          role?: 'admin' | 'superadmin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Helper types
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Order = Tables<'orders'>
export type Contact = Tables<'contacts'>
export type Admin = Tables<'admins'>
