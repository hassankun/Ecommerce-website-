"use client"

import Link from "next/link"
import { Heart, Headphones, Zap, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: number
  image: string
  category: string // type: wireless, gaming, anc
  discount?: number
}

export function ProductCard({ id, slug, name, price, image, category, discount = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const productUrl = `/products/${slug}`
  const discountedPrice = discount > 0 ? price - discount : price

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'gaming': return Zap
      case 'anc': return Volume2
      default: return Headphones
    }
  }

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      wireless: "Wireless",
      gaming: "Gaming",
      anc: "ANC",
      budget: "Budget",
      premium: "Premium",
    }
    return labels[cat] || cat
  }

  const CategoryIcon = getCategoryIcon(category)

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 188, 212, 0.15)" }}
      className="bg-card rounded-xl overflow-hidden shadow-lg border border-border hover:border-primary/50 transition-all duration-300 relative group"
    >
      <Link href={productUrl} title={name}>
        <div className="relative overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 aspect-square flex items-center justify-center p-6">
          <img
            src={imageError ? "/placeholder-earpods.png" : (image || "/placeholder-earpods.png")}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              Save Rs.{discount.toLocaleString()}
            </div>
          )}
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-primary flex items-center gap-1.5 border border-primary/20">
            <CategoryIcon className="w-3.5 h-3.5" />
            {getCategoryLabel(category)}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <Link href={productUrl} title={name}>
          <h3 className="font-outfit font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-2 mb-3 min-h-[3.5rem]">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-primary font-bold text-2xl">
            Rs. {discountedPrice.toLocaleString()}
          </p>
          {discount > 0 && (
            <p className="text-muted-foreground line-through text-sm">
              Rs. {price.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link href={productUrl} className="flex-1" title={`View ${name}`}>
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <Headphones className="w-4 h-4" />
              View Details
            </button>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className="px-3 py-2.5 border border-border rounded-lg hover:bg-primary/10 hover:border-primary/50 transition-all text-primary"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
