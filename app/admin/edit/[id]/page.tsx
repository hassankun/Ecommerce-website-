"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Plus, X, Headphones, Zap, Volume2, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useProducts, Product, CreateProductData } from "@/hooks/useProducts"
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
})

type ProductForm = z.infer<typeof productSchema>

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  const { updateProduct, getProduct } = useProducts()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: 0,
      stock: 50,
      brand: "SonicPods",
      image: "",
      type: "wireless",
      in_stock: true,
      colors: ["Black"],
      noise_cancellation: false,
      transparency_mode: false,
      wireless_charging: false,
    },
  })

  const watchType = watch("type")

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors",
  })

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      try {
        const { id } = await params
        const result = await getProduct(id)
        
        if (!isMounted) return
        
        if (result.success && result.data) {
          const p = result.data
          setProduct(p)
          
          // Extract features from JSONB
          const features = p.features || {}
          
          setTimeout(() => {
            reset({
              name: p.name,
              description: p.description,
              price: p.price,
              discount: p.discount || 0,
              stock: p.stock || 0,
              brand: p.brand || "SonicPods",
              image: p.image || (p.images && p.images[0]) || "",
              type: (p.type as "wireless" | "gaming" | "anc") || "wireless",
              in_stock: p.in_stock !== false,
              colors: p.colors || ["Black"],
              battery_life: features.battery_life || "",
              charging_case_battery: features.charging_case_battery || "",
              bluetooth_version: features.bluetooth_version || "",
              driver_size: features.driver_size || "",
              water_resistance: features.water_resistance || "",
              noise_cancellation: features.noise_cancellation || false,
              transparency_mode: features.transparency_mode || false,
              wireless_charging: features.wireless_charging || false,
              warranty: features.warranty || "",
            })
          }, 100)
        } else {
          toast.error("Product not found")
          router.push("/admin")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        if (isMounted) {
          toast.error("Failed to load product")
          router.push("/admin")
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [params])

  const onSubmit = async (data: ProductForm) => {
    setLoading(true)
    try {
      const { id } = await params
      
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
      
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount || 0,
        stock: data.stock || 0,
        brand: data.brand || "SonicPods",
        image: data.image,
        type: data.type,
        in_stock: data.in_stock,
        colors: data.colors,
        features,
      }
      
      const result = await updateProduct(id, productData)
      if (result.success) {
        toast.success("🎉 Product updated successfully!")
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground">Update {product.name}</p>
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
                { value: "wireless", label: "Wireless", icon: Headphones },
                { value: "gaming", label: "Gaming", icon: Zap },
                { value: "anc", label: "ANC", icon: Volume2 },
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
              placeholder="Enter product description"
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
                  Updating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
