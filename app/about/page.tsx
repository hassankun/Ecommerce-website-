"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Headphones, Target, Eye, Heart, Users, Award, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "100+", label: "Products" },
    { value: "4.9", label: "Average Rating" },
    { value: "24/7", label: "Support" },
  ]

  const values = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "We source only the finest audio products from trusted manufacturers worldwide.",
    },
    {
      icon: Zap,
      title: "Latest Technology",
      description: "Stay ahead with cutting-edge audio technology and the newest innovations.",
    },
    {
      icon: Shield,
      title: "Authentic Products",
      description: "100% genuine products with full manufacturer warranty and support.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go above and beyond for our customers.",
    },
  ]

  const team = [
    { name: "Hassan Ali", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop" },
    { name: "Ahmed Khan", role: "Head of Products", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" },
    { name: "Sara Malik", role: "Customer Success", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop" },
  ]

  return (
    <div className="min-h-screen bg-background bg-tech-pattern">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6">
            <Headphones className="w-4 h-4" />
            About SonicPods
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Redefining the Way You
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Experience Sound</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Born from a passion for premium audio, SonicPods is on a mission to bring 
            world-class sound quality to everyone in Pakistan.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card rounded-2xl border border-border p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=500&fit=crop" 
                alt="Premium Earbuds" 
                className="rounded-2xl shadow-2xl" 
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-bold">2020</p>
                <p className="text-sm">Founded</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-display font-bold mb-6 text-foreground">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                SonicPods was born from a simple frustration: finding quality wireless earbuds in Pakistan 
                without paying exorbitant prices or settling for mediocre products.
              </p>
              <p className="leading-relaxed">
                Our founders, audiophiles themselves, set out to change this. We partnered directly with 
                top manufacturers and built a curated collection of premium audio gear that delivers 
                exceptional sound quality at fair prices.
              </p>
              <p className="leading-relaxed">
                Today, we're proud to serve thousands of customers across Pakistan, helping them 
                experience music, games, and calls the way they were meant to be heard.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl border border-primary/20 p-8"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To make premium audio accessible to everyone in Pakistan by offering 
              authentic, high-quality earbuds at competitive prices with exceptional customer service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gradient-to-br from-accent/10 to-transparent rounded-2xl border border-accent/20 p-8"
          >
            <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4 text-foreground">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become Pakistan's most trusted destination for premium audio gear, 
              known for quality, authenticity, and customer-first approach.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground">What We Stand For</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our core values guide everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6 text-center hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg">Passionate people behind SonicPods</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-3xl border border-primary/20 p-12"
        >
          <Users className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-display font-bold mb-4 text-foreground">Join the SonicPods Family</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Experience the difference of premium audio. Shop our collection and discover 
            why thousands of customers trust SonicPods for their audio needs.
          </p>
          <a 
            href="/collection"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Headphones className="w-5 h-5" />
            Shop Now
          </a>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
