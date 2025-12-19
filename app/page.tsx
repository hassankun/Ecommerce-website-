"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { useProducts, Product } from "@/hooks/useProducts"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Headphones, Bluetooth, BatteryCharging, ShieldCheck, Truck, Award, Zap } from "lucide-react"

export default function Home() {
  const { getProducts } = useProducts()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchProducts = async () => {
      try {
        // First try to get featured products (with discount)
        let result = await getProducts({ featured: true })
        
        if (result.success && result.data && result.data.length > 0) {
          setFeaturedProducts(result.data.slice(0, 8))
        } else {
          // Fallback: get all products
          result = await getProducts()
          if (result.success && result.data) {
            setFeaturedProducts(result.data.slice(0, 8))
          } else {
            setFeaturedProducts([])
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [getProducts])

  const whyChooseUs = [
    {
      title: "Superior Sound",
      description: "Immerse yourself in rich, detailed audio with our expertly tuned drivers.",
      icon: <Headphones className="w-8 h-8" />,
    },
    {
      title: "Latest Bluetooth",
      description: "Featuring Bluetooth 5.3 for seamless connectivity and low latency.",
      icon: <Bluetooth className="w-8 h-8" />,
    },
    {
      title: "All-Day Battery",
      description: "Up to 40 hours of playtime with charging case included.",
      icon: <BatteryCharging className="w-8 h-8" />,
    },
    {
      title: "Premium Quality",
      description: "Durable materials and meticulous craftsmanship for lasting performance.",
      icon: <ShieldCheck className="w-8 h-8" />,
    },
  ]

  const testimonials = [
    {
      name: "Ali Raza",
      text: "SonicPods Pro Max has completely changed my audio experience! The ANC is incredible and battery life is amazing.",
      rating: 5,
    },
    {
      name: "Sara Khan",
      text: "Best earbuds I've ever owned. Crystal clear sound and super comfortable for all-day wear.",
      rating: 5,
    },
    {
      name: "Usman Tariq",
      text: "GamePods X Elite is perfect for gaming. The low latency is a game-changer for competitive play!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium">
                🎧 Premium Audio Experience
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-outfit font-bold mb-6 text-foreground">
              Immersive Audio.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Unleashed.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto font-dm-sans">
              Discover the next generation of wireless earpods, designed for unparalleled sound quality 
              and ultimate comfort. Free delivery across Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/collection">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Shop Now
                </Button>
              </Link>
              <Link href="/collection?category=anc">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-10 py-7 text-lg rounded-full">
                  Explore ANC
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Free Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Warranty Included</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Award className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">100% Authentic</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Fast Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-outfit font-bold mb-4 text-foreground">
              Featured Earpods
            </h2>
            <p className="text-muted-foreground text-lg font-dm-sans">
              Experience crystal-clear sound and cutting-edge technology.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
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
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Headphones className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">
                No products available yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for our latest audio innovations!
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/collection">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg rounded-full">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-outfit font-bold mb-4 text-foreground">
              Why Choose SonicPods
            </h2>
            <p className="text-muted-foreground text-lg font-dm-sans">
              Experience the SonicPods difference in every beat.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl p-6 text-center shadow-lg border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="font-outfit font-bold text-lg mb-2 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm font-dm-sans">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-outfit font-bold mb-4 text-foreground">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg font-dm-sans">
              Join thousands of satisfied audiophiles.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card rounded-xl p-6 shadow-lg border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic font-dm-sans">
                  "{testimonial.text}"
                </p>
                <p className="font-outfit font-bold text-foreground">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4 text-foreground">
              Ready to Upgrade Your Audio?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-dm-sans">
              Shop now and get free delivery across Pakistan. 
              Experience premium sound quality at the best prices.
            </p>
            <Link href="/collection">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg rounded-full shadow-lg">
                Shop All Earpods
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
