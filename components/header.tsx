"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Headphones, Search } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Wireless", href: "/collection?type=wireless" },
    { label: "Gaming", href: "/collection?type=gaming" },
    { label: "ANC", href: "/collection?type=anc" },
    { label: "All Products", href: "/collection" },
    { label: "Track Order", href: "/track-order" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center group-hover:glow-primary transition-all duration-300">
              <Headphones className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-foreground tracking-tight">
              Sonic<span className="text-primary">Pods</span>
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Premium Audio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all duration-200">
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-background/50 rounded text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative group">
            <div className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
