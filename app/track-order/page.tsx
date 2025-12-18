"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Headphones } from "lucide-react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

interface Order {
  id: string
  customer_name: string
  email: string
  phone: string
  address: string
  city?: string
  postal_code?: string
  items: Array<{
    productId: string
    product_name?: string
    quantity: number
    price: number
  }>
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
}

const statusConfig = {
  pending: {
    label: "Order Pending",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
    icon: Clock,
    description: "Your order has been received and is being processed"
  },
  processing: {
    label: "Processing",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    icon: Package,
    description: "Your order is being prepared for shipment"
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10 border-purple-500/20",
    icon: Truck,
    description: "Your order is on its way to you"
  },
  delivered: {
    label: "Delivered",
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/20",
    icon: CheckCircle,
    description: "Your order has been delivered successfully"
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
    icon: XCircle,
    description: "Your order has been cancelled"
  }
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const urlOrderId = searchParams.get("orderId")
    if (urlOrderId) {
      setOrderId(urlOrderId)
      setTimeout(() => {
        handleSearch(new Event("submit") as any)
      }, 500)
    }
  }, [searchParams])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!orderId.trim() && !email.trim()) {
      toast.error("Please enter either Order ID or Email")
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const params = new URLSearchParams()
      if (orderId.trim()) params.append("orderId", orderId.trim())
      if (email.trim()) params.append("email", email.trim())

      const response = await fetch(`/api/orders/track?${params}`)
      const result = await response.json()

      if (result.success && result.data) {
        setOrder(result.data)
        toast.success("Order found!")
      } else {
        setError(result.error || "Order not found")
        toast.error("Order not found")
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setError("Failed to track order. Please try again.")
      toast.error("Failed to track order")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-5 w-5" />
  }

  const getStatusTimeline = (currentStatus: string) => {
    const statuses = ["pending", "processing", "shipped", "delivered"]
    const currentIndex = statuses.indexOf(currentStatus)
    
    return statuses.map((status, index) => {
      const isCompleted = index <= currentIndex
      const isCurrent = index === currentIndex
      const config = statusConfig[status as keyof typeof statusConfig]
      
      return (
        <div key={status} className="flex-1">
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${
              isCompleted ? config.bgColor + " " + config.color : "bg-secondary border-border text-muted-foreground"
            }`}>
              {getStatusIcon(status as keyof typeof statusConfig)}
            </div>
            <p className={`text-xs mt-2 font-medium ${
              isCompleted ? config.color : "text-muted-foreground"
            }`}>
              {config.label}
            </p>
          </div>
          {index < statuses.length - 1 && (
            <div className={`h-0.5 w-full mt-5 -translate-y-8 ${
              index < currentIndex ? "bg-primary" : "bg-border"
            }`} />
          )}
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-background bg-tech-pattern">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <Package className="w-4 h-4" />
            Order Tracking
          </div>
          <h1 className="text-4xl font-display font-bold mb-4 text-foreground">Track Your Order</h1>
          <p className="text-muted-foreground text-lg">
            Enter your Order ID or Email to check the status of your order
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-foreground mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
            
            <div className="text-center">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Track Order
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-destructive">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Order Status */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-display font-bold mb-6 text-foreground">Order Status</h2>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl border ${statusConfig[order.status].bgColor} mr-4`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </h3>
                    <p className="text-muted-foreground">{statusConfig[order.status].description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-mono text-lg font-semibold text-foreground">#{order.id.slice(0, 8)}</p>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status !== "cancelled" && (
                <div className="border-t border-border pt-6">
                  <h4 className="text-lg font-semibold mb-6 text-foreground">Order Progress</h4>
                  <div className="flex">
                    {getStatusTimeline(order.status)}
                  </div>
                </div>
              )}
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Shipping Address</p>
                    <p className="font-medium text-foreground">{order.address}</p>
                    {order.city && (
                      <p className="font-medium text-foreground">{order.city}, {order.postal_code}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date</span>
                    <span className="font-medium text-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium text-foreground">{order.items.length} item(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-primary">Rs. {order.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.product_name || `Product #${item.productId?.slice(0, 8)}`}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">Rs. {item.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total: Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}
