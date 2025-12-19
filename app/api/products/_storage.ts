// Shared in-memory storage for products created during development
// This allows newly created products to be persisted and retrieved

export const productsStorage = new Map<string, any>()

export function addProduct(product: any) {
  productsStorage.set(product.id, product)
  console.log("[ProductStorage] Added product:", product.id, product.name)
}

export function getProduct(id: string) {
  return productsStorage.get(id)
}

export function getProductBySlug(slug: string) {
  for (const product of productsStorage.values()) {
    if (product.slug === slug) {
      return product
    }
  }
  return null
}

export function getAllProducts() {
  return Array.from(productsStorage.values())
}

export function filterProducts(filters: {
  type?: string
  category?: string
  brand?: string
  featured?: boolean
  minPrice?: number
  maxPrice?: number
}) {
  let products = Array.from(productsStorage.values())

  if (filters.type) {
    products = products.filter(p => p.type === filters.type)
  }

  if (filters.category) {
    if (filters.category === 'budget') {
      products = products.filter(p => p.price <= 10000)
    } else if (filters.category === 'premium') {
      products = products.filter(p => p.price >= 15000)
    } else if (['wireless', 'gaming', 'anc'].includes(filters.category)) {
      products = products.filter(p => p.type === filters.category)
    }
  }

  if (filters.brand) {
    products = products.filter(p => p.brand.toLowerCase().includes(filters.brand.toLowerCase()))
  }

  if (filters.featured) {
    products = products.filter(p => p.discount > 0).slice(0, 8)
  }

  if (filters.minPrice) {
    products = products.filter(p => p.price >= filters.minPrice)
  }

  if (filters.maxPrice) {
    products = products.filter(p => p.price <= filters.maxPrice)
  }

  return products
}
