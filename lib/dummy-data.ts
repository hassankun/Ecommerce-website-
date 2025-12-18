// SonicPods - Earpods Dummy Data

export const dummyProducts = [
  {
    id: "1",
    name: "SonicPods Pro Max",
    slug: "sonicpods-pro-max",
    description: "Premium true wireless earbuds with industry-leading Active Noise Cancellation, spatial audio, and up to 30 hours of total battery life. Experience crystal-clear sound with our custom-designed 11mm drivers.",
    price: 24999,
    discount: 2000,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    brand: "SonicPods",
    type: "anc" as const,
    in_stock: true,
    colors: ["Midnight Black", "Arctic White", "Space Gray"],
    features: {
      battery_life: "8 hours",
      charging_case_battery: "30 hours",
      bluetooth_version: "5.3",
      driver_size: "11mm",
      noise_cancellation: true,
      warranty: "2 years"
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "GamePods X Elite",
    slug: "gamepods-x-elite",
    description: "Ultra-low latency gaming earbuds with 40ms response time. RGB lighting, 7.1 virtual surround sound, and detachable boom microphone for competitive gaming.",
    price: 18999,
    discount: 0,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800",
    brand: "SonicPods",
    type: "gaming" as const,
    in_stock: true,
    colors: ["Cyber Red", "Neon Green", "Stealth Black"],
    features: {
      battery_life: "10 hours",
      latency: "40ms",
      rgb_lighting: true,
      surround_sound: "7.1 Virtual",
      warranty: "1 year"
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "AirBuds Lite",
    slug: "airbuds-lite",
    description: "Affordable true wireless earbuds perfect for everyday use. Clear sound, comfortable fit, and reliable Bluetooth connectivity at an unbeatable price.",
    price: 4999,
    discount: 500,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800",
    brand: "SonicPods",
    type: "wireless" as const,
    in_stock: true,
    colors: ["White", "Black", "Blue"],
    features: {
      battery_life: "6 hours",
      bluetooth_version: "5.0",
      water_resistance: "IPX4",
      warranty: "6 months"
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "BassPods Ultra",
    slug: "basspods-ultra",
    description: "For bass lovers - enhanced low-frequency drivers deliver earth-shaking bass while maintaining crystal-clear mids and highs. Perfect for hip-hop and EDM.",
    price: 12999,
    discount: 1500,
    image: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800",
    brand: "SonicPods",
    type: "wireless" as const,
    in_stock: true,
    colors: ["Deep Purple", "Ocean Blue", "Jet Black"],
    features: {
      battery_life: "9 hours",
      driver_size: "13mm",
      bass_boost: true,
      warranty: "1 year"
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    name: "SilentPods ANC",
    slug: "silentpods-anc",
    description: "Entry-level noise cancelling earbuds with impressive ANC performance. Block out the world and focus on your music with up to 35dB noise reduction.",
    price: 9999,
    discount: 0,
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800",
    brand: "SonicPods",
    type: "anc" as const,
    in_stock: true,
    colors: ["Graphite", "Pearl White"],
    features: {
      battery_life: "7 hours",
      noise_reduction: "35dB",
      noise_cancellation: true,
      transparency_mode: true,
      warranty: "1 year"
    },
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    name: "SportPods Flex",
    slug: "sportpods-flex",
    description: "Designed for athletes - secure ear hooks, IP67 water resistance, and sweat-proof design. Never lose your earbuds during intense workouts again.",
    price: 7999,
    discount: 1000,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    brand: "SonicPods",
    type: "wireless" as const,
    in_stock: true,
    colors: ["Volt Yellow", "Sport Red", "Cool Gray"],
    features: {
      battery_life: "12 hours",
      water_resistance: "IP67",
      ear_hooks: true,
      warranty: "1 year"
    },
    created_at: new Date().toISOString(),
  },
]

export const testimonials = [
  {
    name: "Ahmed Khan",
    text: "The SonicPods Pro Max completely changed how I listen to music. The ANC is incredible - I use them daily on my commute and they block out everything. Worth every rupee!",
    rating: 5,
    product: "SonicPods Pro Max",
  },
  {
    name: "Sara Malik",
    text: "As a gamer, the GamePods X Elite are a game-changer. Zero lag, amazing spatial audio, and the boom mic is crystal clear. My teammates love the improved communication.",
    rating: 5,
    product: "GamePods X Elite",
  },
  {
    name: "Hassan Ali",
    text: "Best budget earbuds I've ever owned. The AirBuds Lite punch way above their price. Great sound, comfortable fit, and the battery lasts me all day.",
    rating: 5,
    product: "AirBuds Lite",
  },
]

export const whyChooseUs = [
  {
    title: "Premium Sound Quality",
    description: "Custom-tuned drivers and advanced audio codecs deliver audiophile-grade sound",
    icon: "🎵",
  },
  {
    title: "Latest Technology",
    description: "Bluetooth 5.3, ANC, spatial audio - we bring you the cutting-edge features",
    icon: "🔬",
  },
  {
    title: "Authentic Products",
    description: "100% genuine products with manufacturer warranty and support",
    icon: "✓",
  },
  {
    title: "Fast Delivery",
    description: "Free shipping on orders over Rs. 10,000. Same-day dispatch available",
    icon: "🚚",
  },
]

export const featuredBrands = [
  { name: "SonicPods", logo: "/brands/sonicpods.png" },
  { name: "Sony", logo: "/brands/sony.png" },
  { name: "JBL", logo: "/brands/jbl.png" },
  { name: "Samsung", logo: "/brands/samsung.png" },
  { name: "Apple", logo: "/brands/apple.png" },
  { name: "Bose", logo: "/brands/bose.png" },
]

export const productCategories = [
  { name: "Wireless", slug: "wireless", description: "True wireless earbuds" },
  { name: "Gaming", slug: "gaming", description: "Low-latency gaming earbuds" },
  { name: "ANC", slug: "anc", description: "Active Noise Cancellation" },
  { name: "Budget", slug: "budget", description: "Affordable options" },
  { name: "Premium", slug: "premium", description: "High-end audiophile grade" },
]

export const productSpecifications = {
  battery_life: "Battery Life (Single Charge)",
  charging_case_battery: "Total Battery with Case",
  bluetooth_version: "Bluetooth Version",
  driver_size: "Driver Size",
  frequency_response: "Frequency Response",
  impedance: "Impedance",
  water_resistance: "Water Resistance",
  noise_cancellation: "Active Noise Cancellation",
  transparency_mode: "Transparency Mode",
  wireless_charging: "Wireless Charging",
  fast_charging: "Fast Charging",
  codec_support: "Codec Support",
  microphone: "Built-in Microphone",
  touch_controls: "Touch Controls",
  voice_assistant: "Voice Assistant Support",
  multipoint_connection: "Multipoint Connection",
  warranty: "Warranty",
  latency: "Latency",
  rgb_lighting: "RGB Lighting",
  surround_sound: "Surround Sound",
}
