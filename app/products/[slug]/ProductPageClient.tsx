"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw, 
  ChevronRight,
  Battery,
  Bluetooth,
  Volume2,
  Mic,
  Droplets,
  Headphones,
  Zap
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { productSpecifications } from "@/lib/dummy-data"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount?: number
  stock?: number
  brand?: string
  image: string
  images?: string[]
  type: "wireless" | "gaming" | "anc"
  features?: Record<string, any>
  colors: string[]
  in_stock: boolean
  seo_title?: string | null
  seo_description?: string | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string[]
  created_at: string
  updated_at: string
}

interface ProductPageClientProps {
  product: Product
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  )
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeImage, setActiveImage] = useState(product.image)

  // Calculate final price
  const discount = product.discount || 0
  const finalPrice = discount > 0 ? product.price - discount : product.price
  const discountPercentage = discount > 0 ? Math.round((discount / product.price) * 100) : 0

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      quantity,
      image: product.image,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} at SonicPods!`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const getTypeConfig = (type: string) => {
    const configs: Record<string, { icon: any; label: string; color: string }> = {
      wireless: { icon: Headphones, label: "Wireless", color: "text-cyan-400 bg-cyan-400/10" },
      gaming: { icon: Zap, label: "Gaming", color: "text-red-400 bg-red-400/10" },
      anc: { icon: Volume2, label: "ANC", color: "text-purple-400 bg-purple-400/10" },
    }
    return configs[type] || configs.wireless
  }

  const typeConfig = getTypeConfig(product.type)
  const TypeIcon = typeConfig.icon

  // Feature icons mapping
  const featureIcons: Record<string, any> = {
    battery_life: Battery,
    charging_case_battery: Battery,
    bluetooth_version: Bluetooth,
    noise_cancellation: Volume2,
    transparency_mode: Volume2,
    water_resistance: Droplets,
    microphone: Mic,
    latency: Zap,
  }

  // Get all images for gallery
  const allImages = product.images && product.images.length > 0 
    ? [product.image, ...product.images.filter(img => img !== product.image)]
    : [product.image]

  return (
    <div className="min-h-screen bg-background bg-tech-pattern">
      <Header />

      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4 border-b border-border" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li>
            <Link href="/collection" className="hover:text-primary transition-colors">Products</Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li>
            <Link href={`/collection?type=${product.type}`} className="hover:text-primary transition-colors capitalize">
              {typeConfig.label}
            </Link>
          </li>
          <li><ChevronRight className="w-4 h-4" /></li>
          <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <article itemScope itemType="https://schema.org/Product">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="bg-card rounded-2xl overflow-hidden aspect-square relative border border-border">
                <img
                  src={activeImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  itemProp="image"
                  loading="eager"
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-full text-sm font-bold">
                    -{discountPercentage}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Type Badge & Stock Status */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${typeConfig.color}`}>
                  <TypeIcon className="w-4 h-4" />
                  {typeConfig.label}
                </span>
                {product.in_stock ? (
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-destructive text-sm font-medium">Out of Stock</span>
                )}
              </div>

              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {product.brand}
                </p>
              )}

              {/* Product Name & Price */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-3" itemProp="name">
                  {product.name}
                </h1>
                <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="flex items-center gap-4">
                  <p className="text-3xl font-bold text-primary">
                    Rs. <span itemProp="price" content={finalPrice.toString()}>{finalPrice.toLocaleString()}</span>
                  </p>
                  {discount > 0 && (
                    <p className="text-xl text-muted-foreground line-through">
                      Rs. {product.price.toLocaleString()}
                    </p>
                  )}
                  <meta itemProp="priceCurrency" content="PKR" />
                  <meta itemProp="url" content={`/products/${product.slug}`} />
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground text-lg leading-relaxed" itemProp="description">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              {product.features && Object.keys(product.features).length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.features).slice(0, 4).map(([key, value]) => {
                    if (typeof value === 'boolean' && !value) return null
                    const Icon = featureIcons[key] || Headphones
                    const label = productSpecifications[key as keyof typeof productSpecifications] || key
                    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value
                    return (
                      <div key={key} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                        <Icon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm font-medium text-foreground">{displayValue}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="font-semibold mb-3 text-foreground">
                    Color: <span className="font-normal text-primary">{selectedColor}</span>
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border-2 rounded-lg font-medium text-sm transition-all ${
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h2 className="font-semibold mb-3 text-foreground">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center text-foreground"
                    disabled={!product.in_stock}
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center text-foreground">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center text-foreground"
                    disabled={!product.in_stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className={`flex-1 py-6 text-lg transition-all ${
                    addedToCart
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart - Rs. {(finalPrice * quantity).toLocaleString()}
                    </>
                  )}
                </Button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 h-14 border-2 rounded-lg transition-all flex items-center justify-center ${
                    isWishlisted 
                      ? "border-destructive bg-destructive/10 text-destructive" 
                      : "border-border hover:border-primary text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-14 h-14 border-2 border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center text-muted-foreground hover:text-primary"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">Orders over Rs. 10,000</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">Warranty</p>
                  <p className="text-xs text-muted-foreground">Manufacturer warranty</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">7-day policy</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full Specifications */}
          {product.features && Object.keys(product.features).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-16"
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">Technical Specifications</h2>
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {Object.entries(product.features).map(([key, value], index) => {
                    if (typeof value === 'boolean' && !value) return null
                    const label = productSpecifications[key as keyof typeof productSpecifications] || key.replace(/_/g, ' ')
                    let displayValue = value
                    if (typeof value === 'boolean') {
                      displayValue = value ? '✓ Yes' : '✗ No'
                    } else if (Array.isArray(value)) {
                      displayValue = value.join(', ')
                    }
                    return (
                      <div 
                        key={key} 
                        className={`flex justify-between items-center p-4 ${
                          index % 2 === 0 ? 'bg-secondary/30' : 'bg-transparent'
                        } border-b border-border last:border-b-0`}
                      >
                        <span className="text-muted-foreground capitalize">{label}</span>
                        <span className="font-medium text-foreground">{displayValue}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Brand info - hidden but for SEO */}
          <div itemProp="brand" itemScope itemType="https://schema.org/Brand" className="hidden">
            <meta itemProp="name" content={product.brand || "SonicPods"} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
