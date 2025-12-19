"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount: number
  stock: number
  brand: string | null
  type: string // wireless, gaming, anc
  category_id: string | null
  features: Record<string, any> | null // JSONB for technical specs
  images: string[] | null // Array of image URLs
  image: string | null // Primary image for backwards compatibility
  colors: string[] | null
  in_stock: boolean
  // SEO fields
  seo_title: string | null
  seo_description: string | null
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  // Timestamps
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  discount?: number
  stock?: number
  brand?: string
  type: string // wireless, gaming, anc
  category_id?: string
  features?: Record<string, any>
  images?: string[]
  image?: string
  colors?: string[]
  in_stock?: boolean
}

// Simple cache to prevent duplicate API calls
const productCache: {
  data: Product[] | null
  timestamp: number
  pending: Promise<any> | null
} = {
  data: null,
  timestamp: 0,
  pending: null,
}

const CACHE_DURATION = 30000 // 30 seconds cache

export function useProducts(autoFetch: boolean = false) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getProducts()

      if (response.success) {
        setProducts(response.data || [])
        productCache.data = response.data || []
        productCache.timestamp = Date.now()
      } else {
        setError(response.error || "Failed to fetch products")
        toast.error(response.error || "Failed to fetch products")
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching products"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(async (productData: CreateProductData) => {
    try {
      const response = await apiClient.createProduct(productData)

      if (response.success) {
        toast.success("Product created successfully!")
        productCache.data = null // Invalidate cache
        await fetchProducts() // Refresh the list
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || "Failed to create product")
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMessage = "An error occurred while creating product"
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [fetchProducts])

  const updateProduct = useCallback(async (
    id: string,
    productData: Partial<CreateProductData>
  ) => {
    try {
      const response = await apiClient.updateProduct(id, productData)

      if (response.success) {
        toast.success("Product updated successfully!")
        productCache.data = null // Invalidate cache
        await fetchProducts() // Refresh the list
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || "Failed to update product")
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMessage = "An error occurred while updating product"
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [fetchProducts])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await apiClient.deleteProduct(id)

      if (response.success) {
        toast.success("Product deleted successfully!")
        productCache.data = null // Invalidate cache
        await fetchProducts() // Refresh the list
        return { success: true }
      } else {
        toast.error(response.error || "Failed to delete product")
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMessage = "An error occurred while deleting product"
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [fetchProducts])

  const getProducts = useCallback(async (filters?: {
    type?: string;
    category?: string;
    brand?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      // Check cache for non-filtered requests
      if (!filters || Object.keys(filters).length === 0) {
        const now = Date.now()
        if (productCache.data && (now - productCache.timestamp) < CACHE_DURATION) {
          return { success: true, data: productCache.data }
        }

        // If there's a pending request, wait for it
        if (productCache.pending) {
          return await productCache.pending
        }
      }

      // Create the request promise
      const requestPromise = (async () => {
        const response = await apiClient.getProducts(filters)

        if (response.success) {
          // Cache non-filtered results
          if (!filters || Object.keys(filters).length === 0) {
            productCache.data = response.data
            productCache.timestamp = Date.now()
          }
          return { success: true, data: response.data }
        } else {
          return { success: false, error: response.error }
        }
      })();

      // Store pending promise for non-filtered requests
      if (!filters || Object.keys(filters).length === 0) {
        productCache.pending = requestPromise
        try {
          const result = await requestPromise
          return result
        } finally {
          productCache.pending = null
        }
      }

      return await requestPromise
    } catch (err) {
      console.error("getProducts error:", err)
      const errorMessage = "An error occurred while fetching products"
      return { success: false, error: errorMessage }
    }
  }, [])

  const getProduct = useCallback(async (id: string) => {
    try {
      const response = await apiClient.getProduct(id)

      if (response.success) {
        return { success: true, data: response.data }
      } else {
        toast.error(response.error || "Failed to fetch product")
        return { success: false, error: response.error }
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching product"
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }, [])

  // Only auto-fetch if explicitly enabled and not already fetched
  useEffect(() => {
    if (autoFetch && !fetchedRef.current) {
      fetchedRef.current = true
      fetchProducts()
    } else if (!autoFetch) {
      setLoading(false)
    }
  }, [autoFetch, fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  }
}
