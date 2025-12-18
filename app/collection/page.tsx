"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { useProducts, Product } from "@/hooks/useProducts"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Filter, X, Headphones, Zap, Volume2, DollarSign, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useSearchParams, useRouter } from "next/navigation"

export default function CollectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getProducts } = useProducts()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false)

  // Filter states
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [sortOrder, setSortOrder] = useState<string>("popularity")

  // Debounce for price range slider
  const priceRangeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchAndFilterProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters: any = {}
      
      // Map category to type filter
      if (activeCategory !== "all") {
        if (['wireless', 'gaming', 'anc'].includes(activeCategory)) {
          filters.type = activeCategory
        } else {
          filters.category = activeCategory
        }
      }
      
      if (brandFilter !== "all") {
        filters.brand = brandFilter
      }

      const result = await getProducts(filters)

      if (result.success && result.data) {
        let filtered = result.data.filter((p: Product) => {
          const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1]
          return priceMatch
        })

        // Apply sorting
        filtered.sort((a: Product, b: Product) => {
          if (sortOrder === "price-asc") return a.price - b.price
          if (sortOrder === "price-desc") return b.price - a.price
          if (sortOrder === "new-arrivals") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          // Default popularity - sort by discount (products with discount are more "popular")
          return (b.discount || 0) - (a.discount || 0)
        })

        setProducts(filtered)
      } else {
        setProducts([])
        setError(result.error || "Failed to fetch products")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("An unexpected error occurred.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [activeCategory, brandFilter, priceRange, sortOrder, getProducts])

  useEffect(() => {
    // Initialize filters from URL params
    const urlCategory = searchParams.get("category")
    if (urlCategory) setActiveCategory(urlCategory)

    const urlBrand = searchParams.get("brand")
    if (urlBrand) setBrandFilter(urlBrand)

    const urlSort = searchParams.get("sort")
    if (urlSort) setSortOrder(urlSort)

    if (!hasFetched.current) {
      hasFetched.current = true
      fetchAndFilterProducts()
    }
  }, [searchParams])

  useEffect(() => {
    // Re-fetch when filters change (but not on initial mount)
    if (hasFetched.current) {
      // Update URL params when filters change
      const params = new URLSearchParams()
      if (activeCategory !== "all") params.set("category", activeCategory)
      if (brandFilter !== "all") params.set("brand", brandFilter)
      if (sortOrder !== "popularity") params.set("sort", sortOrder)

      router.push(`/collection?${params.toString()}`, { scroll: false })
      fetchAndFilterProducts()
    }
  }, [activeCategory, brandFilter, sortOrder, router])

  const handlePriceRangeChange = (value: number[]) => {
    const newRange = [value[0], value[1]] as [number, number]
    setPriceRange(newRange)
    if (priceRangeTimeoutRef.current) {
      clearTimeout(priceRangeTimeoutRef.current)
    }
    priceRangeTimeoutRef.current = setTimeout(() => {
      fetchAndFilterProducts()
    }, 500)
  }

  // Get unique brands from products
  const allBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean) as string[]

  const categories = [
    { key: "all", label: "All Earpods", icon: Headphones },
    { key: "wireless", label: "Wireless", icon: Headphones },
    { key: "gaming", label: "Gaming", icon: Zap },
    { key: "anc", label: "ANC", icon: Volume2 },
    { key: "budget", label: "Budget", icon: DollarSign },
    { key: "premium", label: "Premium", icon: Crown },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-outfit font-bold mb-4">Our Earpods Collection</h1>
          <p className="text-muted-foreground text-lg font-dm-sans">Explore our premium wireless, gaming, and noise-cancelling audio devices.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-card rounded-xl p-6 shadow-lg border border-border h-fit sticky top-24"
          >
            <h2 className="text-xl font-outfit font-bold mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" /> Filters
            </h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Category</h3>
              <div className="flex flex-col space-y-2">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <Button
                      key={cat.key}
                      variant={activeCategory === cat.key ? "default" : "ghost"}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`justify-start gap-2 ${activeCategory === cat.key ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:bg-muted/20"}`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Brand Filter */}
            {allBrands.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">Brand</h3>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger className="w-full bg-input border-border text-foreground">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="all">All Brands</SelectItem>
                    {allBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Price Range (Rs.)</h3>
              <Slider
                min={0}
                max={50000}
                step={1000}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Rs. {priceRange[0].toLocaleString()}</span>
                <span>Rs. {priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Sort By</h3>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full bg-input border-border text-foreground">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                setActiveCategory("all")
                setBrandFilter("all")
                setPriceRange([0, 50000])
                setSortOrder("popularity")
              }}
              variant="outline"
              className="w-full mt-4 text-primary border-primary hover:bg-primary/10"
            >
              <X className="w-4 h-4 mr-2" /> Clear Filters
            </Button>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                <p className="text-lg">{error}</p>
                <Button onClick={fetchAndFilterProducts} className="mt-4">Try Again</Button>
              </div>
            ) : products.length > 0 ? (
              <motion.div
                key={activeCategory + brandFilter + sortOrder}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      image={product.image || (product.images && product.images[0]) || "/placeholder-earpods.png"}
                      category={product.type}
                      discount={product.discount}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-card rounded-xl p-8 shadow-lg border border-border">
                <Headphones className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg mb-2">No earpods match your current filters.</p>
                <p className="text-sm text-muted-foreground">Try adjusting your selections or clear all filters.</p>
                <Button onClick={() => {
                  setActiveCategory("all")
                  setBrandFilter("all")
                  setPriceRange([0, 50000])
                  setSortOrder("popularity")
                }} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
