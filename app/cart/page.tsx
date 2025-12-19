"use client"

import { useCart } from "@/context/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Headphones } from "lucide-react"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

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
            <div className="w-24 h-24 mx-auto mb-6 bg-card rounded-2xl border border-border flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2 text-foreground">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
            <Link href="/collection">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                <Headphones className="w-5 h-5 mr-2" />
                Browse Products
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  const shipping = 500
  const tax = Math.round(total * 0.17)
  const grandTotal = total + shipping + tax

  return (
    <div className="min-h-screen bg-background bg-tech-pattern">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold mb-8 text-foreground"
        >
          Shopping Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-4 md:p-6 flex gap-4 hover:border-primary/30 transition-colors"
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground truncate">{item.name}</h3>
                    <p className="text-primary font-bold mt-1">Rs. {item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center bg-secondary rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-secondary/80 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4 text-foreground" />
                        </button>
                        <span className="px-4 py-2 text-foreground font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-secondary/80 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)} 
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-lg text-foreground">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-display font-bold mb-6 text-foreground">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.length} items)</span>
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
              
              <div className="flex justify-between text-lg font-bold mb-6 text-foreground">
                <span>Total</span>
                <span className="text-primary">Rs. {grandTotal.toLocaleString()}</span>
              </div>
              
              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 mb-3">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full border-border hover:bg-secondary text-foreground" 
                onClick={clearCart}
              >
                Clear Cart
              </Button>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span>🔒 Secure Checkout</span>
                  <span>🚚 Free Shipping 10K+</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
