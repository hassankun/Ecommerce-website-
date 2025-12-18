"use client"

import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { createOrder } from "@/lib/api"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { CreditCard, Truck, ShieldCheck, Headphones } from "lucide-react"
import Link from "next/link"

interface CheckoutFormData {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>()

  const shipping = 500
  const tax = Math.round(total * 0.17)
  const grandTotal = total + shipping + tax

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsLoading(true)
    try {
      const orderData = {
        customer_name: data.customerName,
        email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.city}, ${data.postalCode}`,
        city: data.city,
        postal_code: data.postalCode,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: grandTotal,
        status: "pending",
      }

      const order = await createOrder(orderData)
      if (order && order.id) {
        toast.success(`Order placed successfully!`)
        clearCart()
        router.push(`/track-order?orderId=${order.id}`)
      } else {
        throw new Error("Failed to create order")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background bg-tech-pattern">
        <Header />
        <div className="flex items-center justify-center py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-display font-bold mb-2 text-foreground">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add items to your cart before checking out</p>
            <Link href="/collection">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Headphones className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-tech-pattern">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold mb-8 text-foreground"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-xl font-display font-bold mb-6 text-foreground">Shipping Information</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                <Input
                  {...register("customerName", { required: "Name is required" })}
                  placeholder="Your full name"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.customerName && (
                  <p className="text-destructive text-sm mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                <Input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="your@email.com"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                <Input
                  {...register("phone", { required: "Phone is required" })}
                  placeholder="+92 300 1234567"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                <Input
                  {...register("address", { required: "Address is required" })}
                  placeholder="Street address"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.address && (
                  <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                  <Input
                    {...register("city", { required: "City is required" })}
                    placeholder="City"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.city && (
                    <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Postal Code *</label>
                  <Input
                    {...register("postalCode", { required: "Postal code is required" })}
                    placeholder="54000"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                  {errors.postalCode && (
                    <p className="text-destructive text-sm mt-1">{errors.postalCode.message}</p>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Secure</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <CreditCard className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">COD Available</p>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 mt-6"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order - Rs. ${grandTotal.toLocaleString()}`
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl border border-border p-6 h-fit"
          >
            <h2 className="text-xl font-display font-bold mb-6 text-foreground">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <img 
                    src={item.image || "/placeholder.svg"} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-foreground">Rs. {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (17%)</span>
                <span className="text-foreground">Rs. {tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-foreground">
              <span>Total</span>
              <span className="text-primary">Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
