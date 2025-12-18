"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Plus, X, Sparkles, Loader2, Headphones, Zap, Volume2, Wand2, Eye, Search, Share2, Twitter } from "lucide-react"
import Link from "next/link"
import { useProducts, CreateProductData } from "@/hooks/useProducts"
import toast from "react-hot-toast"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  discount: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  brand: z.string().optional(),
  image: z.string().url("Please enter a valid image URL"),
  type: z.enum(["wireless", "gaming", "anc"], {
    required_error: "Please select a type",
  }),
  in_stock: z.boolean().default(true),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  // Technical specifications
  battery_life: z.string().optional(),
  charging_case_battery: z.string().optional(),
  bluetooth_version: z.string().optional(),
  driver_size: z.string().optional(),
  water_resistance: z.string().optional(),
  noise_cancellation: z.boolean().optional(),
  transparency_mode: z.boolean().optional(),
  wireless_charging: z.boolean().optional(),
  warranty: z.string().optional(),
  // SEO Fields (AI Generated but editable)
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  meta_keywords: z.string().optional(),
  og_title: z.string().optional(),
  og_description: z.string().optional(),
  twitter_title: z.string().optional(),
  twitter_description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
})

type ProductForm = z.infer<typeof productSchema>

interface SEOData {
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_title: string
  og_description: string
  twitter_title: string
  twitter_description: string
  seo_title: string
  seo_description: string
  productDescription: string
}

export default function AddProduct() {
  const [loading, setLoading] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [generatingSEO, setGeneratingSEO] = useState(false)
  const [seoGenerated, setSeoGenerated] = useState(false)
  const router = useRouter()
  const { createProduct } = useProducts()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      in_stock: true,
      colors: ["Black"],
      discount: 0,
      stock: 50,
      brand: "SonicPods",
      noise_cancellation: false,
      transparency_mode: false,
      wireless_charging: false,
    },
  })

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors",
  })

  const watchName = watch("name")
  const watchType = watch("type")
  const watchPrice = watch("price")
  const watchDescription = watch("description")

  // Generate description using AI
  const generateDescription = async () => {
    if (!watchName) {
      toast.error("Please enter a product name first")
      return
    }
    if (!watchType) {
      toast.error("Please select a product type first")
      return
    }

    setGeneratingDescription(true)
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: watchName,
          type: watchType,
          category: "earbuds",
          collection: "SonicPods",
        }),
      })

      const data = await response.json()
      
      if (data.success && data.description) {
        setValue("description", data.description)
        toast.success("✨ AI generated description!")
      } else {
        toast.error(data.error || "Failed to generate description")
      }
    } catch (error) {
      toast.error("Failed to generate description")
    } finally {
      setGeneratingDescription(false)
    }
  }

  // Generate all SEO content using AI
  const generateSEO = async () => {
    if (!watchName) {
      toast.error("Please enter a product name first")
      return
    }
    if (!watchType) {
      toast.error("Please select a product type first")
      return
    }
    if (!watchPrice) {
      toast.error("Please enter a price first")
      return
    }

    setGeneratingSEO(true)
    try {
      const response = await fetch("/api/ai/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: watchName,
          type: watchType,
          price: watchPrice,
          brand: getValues("brand") || "SonicPods",
          description: watchDescription || "",
        }),
      })

      const data = await response.json()
      
      if (data.success && data.seo) {
        const seo = data.seo as SEOData
        setValue("meta_title", seo.meta_title)
        setValue("meta_description", seo.meta_description)
        setValue("meta_keywords", seo.meta_keywords)
        setValue("og_title", seo.og_title)
        setValue("og_description", seo.og_description)
        setValue("twitter_title", seo.twitter_title)
        setValue("twitter_description", seo.twitter_description)
        setValue("seo_title", seo.seo_title)
        setValue("seo_description", seo.seo_description)
        
        // Also set description if empty
        if (!watchDescription && seo.productDescription) {
          setValue("description", seo.productDescription)
        }
        
        setSeoGenerated(true)
        toast.success("✨ AI generated all SEO content!")
      } else {
        toast.error(data.error || "Failed to generate SEO content")
      }
    } catch (error) {
      toast.error("Failed to generate SEO content")
    } finally {
      setGeneratingSEO(false)
    }
  }

  const onSubmit = async (data: ProductForm) => {
    setLoading(true)
    try {
      // Build features object
      const features: Record<string, any> = {}
      if (data.battery_life) features.battery_life = data.battery_life
      if (data.charging_case_battery) features.charging_case_battery = data.charging_case_battery
      if (data.bluetooth_version) features.bluetooth_version = data.bluetooth_version
      if (data.driver_size) features.driver_size = data.driver_size
      if (data.water_resistance) features.water_resistance = data.water_resistance
      if (data.noise_cancellation) features.noise_cancellation = data.noise_cancellation
      if (data.transparency_mode) features.transparency_mode = data.transparency_mode
      if (data.wireless_charging) features.wireless_charging = data.wireless_charging
      if (data.warranty) features.warranty = data.warranty

      const productData: any = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount || 0,
        stock: data.stock || 50,
        brand: data.brand || "SonicPods",
        image: data.image,
        type: data.type,
        in_stock: data.in_stock,
        colors: data.colors,
        features,
        // SEO Fields
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords?.split(",").map(k => k.trim()) || [],
        og_title: data.og_title,
        og_description: data.og_description,
        twitter_title: data.twitter_title,
        twitter_description: data.twitter_description,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
      }

      const result = await createProduct(productData)
      if (result.success) {
        toast.success("🎉 Product created successfully!")
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin"
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground">Create a new earbuds product with AI-powered SEO</p>
        </div>
      </div>

      {/* AI Info Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground">AI-Powered SEO Generation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Generate SEO with AI" to automatically create meta title, description, OpenGraph tags, 
              Twitter cards, and SEO-optimized content for better search engine visibility.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Product Name *
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="e.g. SonicPods Pro Max"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Brand
              </label>
              <input
                {...register("brand")}
                type="text"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="e.g. SonicPods"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price (PKR) *
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="1"
                min="0"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="24999"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Discount (PKR)
              </label>
              <input
                {...register("discount", { valueAsNumber: true })}
                type="number"
                step="1"
                min="0"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock Quantity
              </label>
              <input
                {...register("stock", { valueAsNumber: true })}
                type="number"
                step="1"
                min="0"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                placeholder="50"
              />
            </div>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Product Type *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "wireless", label: "Wireless", icon: Headphones, color: "cyan" },
                { value: "gaming", label: "Gaming", icon: Zap, color: "red" },
                { value: "anc", label: "ANC", icon: Volume2, color: "purple" },
              ].map((type) => {
                const isSelected = watchType === type.value
                const Icon = type.icon
                return (
                  <label
                    key={type.value}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      {...register("type")}
                      type="radio"
                      value={type.value}
                      className="sr-only"
                    />
                    <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {type.label}
                    </span>
                  </label>
                )
              })}
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Description with AI Generate Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Description *
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generatingDescription || !watchName || !watchType}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generatingDescription ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              placeholder="Enter product description or click 'Generate with AI' to auto-generate"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Image URL *
            </label>
            <input
              {...register("image")}
              type="url"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-destructive">{errors.image.message}</p>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Battery Life
                </label>
                <input
                  {...register("battery_life")}
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. 8 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Case Battery
                </label>
                <input
                  {...register("charging_case_battery")}
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. 30 hours"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Bluetooth Version
                </label>
                <input
                  {...register("bluetooth_version")}
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. 5.3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Driver Size
                </label>
                <input
                  {...register("driver_size")}
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. 11mm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Water Resistance
                </label>
                <input
                  {...register("water_resistance")}
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. IPX4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Warranty
                </label>
                <input
                  {...register("warranty")}
                  type="text"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                  placeholder="e.g. 1 year"
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <label className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer">
                <input
                  {...register("noise_cancellation")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Noise Cancellation</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer">
                <input
                  {...register("transparency_mode")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Transparency Mode</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer">
                <input
                  {...register("wireless_charging")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Wireless Charging</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-secondary rounded-lg cursor-pointer">
                <input
                  {...register("in_stock")}
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">In Stock</span>
              </label>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Available Colors *
            </label>
            <div className="space-y-2">
              {colorFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`colors.${index}`)}
                    type="text"
                    className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter color"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendColor("")}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Color</span>
              </button>
            </div>
            {errors.colors && (
              <p className="mt-1 text-sm text-destructive">{errors.colors.message}</p>
            )}
          </div>

          {/* ============================================= */}
          {/* AI-Generated SEO Section */}
          {/* ============================================= */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                  <Wand2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">AI-Generated SEO Content</h3>
                  <p className="text-sm text-muted-foreground">Auto-generate meta tags and social sharing content</p>
                </div>
              </div>
              <button
                type="button"
                onClick={generateSEO}
                disabled={generatingSEO || !watchName || !watchType || !watchPrice}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {generatingSEO ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating SEO...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate SEO with AI
                  </>
                )}
              </button>
            </div>

            {seoGenerated && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  SEO content generated! You can edit the fields below before saving.
                </p>
              </div>
            )}

            {/* Meta Tags Section */}
            <div className="space-y-6">
              <div className="bg-secondary/50 rounded-xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Meta Tags (Search Engines)</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Meta Title <span className="text-xs">(50-60 chars recommended)</span>
                    </label>
                    <input
                      {...register("meta_title")}
                      type="text"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="e.g. SonicPods Pro Max - Buy Wireless Earbuds Online Pakistan"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {watch("meta_title")?.length || 0}/60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Meta Description <span className="text-xs">(150-160 chars recommended)</span>
                    </label>
                    <textarea
                      {...register("meta_description")}
                      rows={2}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="e.g. Get SonicPods Pro Max for Rs. 24,999. Premium wireless earbuds with ANC. Free delivery across Pakistan!"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {watch("meta_description")?.length || 0}/160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Meta Keywords <span className="text-xs">(comma separated)</span>
                    </label>
                    <input
                      {...register("meta_keywords")}
                      type="text"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="e.g. wireless earbuds, earpods pakistan, bluetooth earphones, anc earbuds"
                    />
                  </div>
                </div>
              </div>

              {/* OpenGraph Section */}
              <div className="bg-secondary/50 rounded-xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 className="w-5 h-5 text-blue-400" />
                  <h4 className="font-semibold text-foreground">OpenGraph Tags (Facebook/LinkedIn)</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      OG Title
                    </label>
                    <input
                      {...register("og_title")}
                      type="text"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="e.g. SonicPods Pro Max - Premium Wireless Earbuds"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      OG Description
                    </label>
                    <textarea
                      {...register("og_description")}
                      rows={2}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="Description shown when sharing on Facebook/LinkedIn"
                    />
                  </div>
                </div>
              </div>

              {/* Twitter Card Section */}
              <div className="bg-secondary/50 rounded-xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Twitter className="w-5 h-5 text-sky-400" />
                  <h4 className="font-semibold text-foreground">Twitter Card</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Twitter Title
                    </label>
                    <input
                      {...register("twitter_title")}
                      type="text"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="e.g. SonicPods Pro Max | Premium Audio"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Twitter Description
                    </label>
                    <textarea
                      {...register("twitter_description")}
                      rows={2}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="Description shown when sharing on Twitter"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Content Section */}
              <div className="bg-secondary/50 rounded-xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-foreground">SEO Content (Page Display)</h4>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      SEO Title (H1 Heading)
                    </label>
                    <input
                      {...register("seo_title")}
                      type="text"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="e.g. SonicPods Pro Max - Premium ANC Wireless Earbuds"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      SEO Description (Intro Paragraph)
                    </label>
                    <textarea
                      {...register("seo_description")}
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                      placeholder="SEO-optimized introduction paragraph for the product page"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Link
              href="/admin"
              className="px-6 py-3 text-center text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
