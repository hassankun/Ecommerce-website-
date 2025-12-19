/**
 * Groq AI Integration for SEO Generation
 * Using Llama 3.3 70B model for high-quality SEO content
 * Optimized for SonicPods Earpods Store
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

export interface ProductSEO {
  // Meta Tags
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  
  // OpenGraph Tags
  ogTitle: string
  ogDescription: string
  ogType: string
  
  // Twitter Card
  twitterTitle: string
  twitterDescription: string
  
  // SEO Content
  seoTitle: string
  seoDescription: string
  seoSlug: string
  
  // Structured Data hints
  schemaDescription: string
  
  // Generated Description
  productDescription: string
}

interface ProductInput {
  name: string
  description?: string
  price: number
  type: string
  brand?: string
  features?: Record<string, any>
}

/**
 * Generate comprehensive SEO content for an earpods product using Groq AI
 */
export async function generateProductSEO(product: ProductInput): Promise<ProductSEO | null> {
  if (!GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY not set. Using fallback SEO generation.")
    return generateFallbackSEO(product)
  }

  const typeLabels: Record<string, string> = {
    wireless: "True Wireless Earbuds",
    gaming: "Gaming Earbuds",
    anc: "ANC (Noise Cancelling) Earbuds",
  }

  const featuresText = product.features 
    ? Object.entries(product.features).map(([k, v]) => `${k}: ${v}`).join(", ")
    : ""

  const prompt = `You are an expert SEO copywriter for "SonicPods", a premium earpods and wireless audio store in Pakistan. Generate comprehensive SEO content for this product:

Product Name: ${product.name}
Type: ${typeLabels[product.type] || product.type}
Price: Rs. ${product.price.toLocaleString()}
Brand: ${product.brand || 'SonicPods'}
${product.description ? `Brief Info: ${product.description}` : ''}
${featuresText ? `Features: ${featuresText}` : ''}

Generate the following in JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
  "metaTitle": "SEO meta title (50-60 chars, include brand + product type + 'Buy Online Pakistan')",
  "metaDescription": "Meta description (150-160 chars, include price, key benefits, call-to-action like 'Shop Now' or 'Free Delivery')",
  "metaKeywords": ["array", "of", "15-20", "relevant", "SEO", "keywords"],
  "ogTitle": "OpenGraph title for social sharing (60-70 chars)",
  "ogDescription": "OpenGraph description for Facebook/LinkedIn (150-200 chars)",
  "ogType": "product",
  "twitterTitle": "Twitter card title (55-60 chars)",
  "twitterDescription": "Twitter description (120-140 chars)",
  "seoTitle": "H1 heading for product page (include product name and key feature)",
  "seoDescription": "SEO-optimized product intro paragraph (100-150 words, naturally include keywords)",
  "seoSlug": "url-friendly-slug-lowercase-hyphens-max-50-chars",
  "schemaDescription": "Clean description for schema.org structured data (100-150 words)",
  "productDescription": "Compelling product description (150-200 words, highlight features, benefits, use cases, no bullet points, flowing paragraphs)"
}

Requirements:
- All content should be in English, suitable for Pakistani audience
- Include relevant keywords: wireless earbuds, earpods, Bluetooth, audio, Pakistan, online shopping
- metaTitle must include the product name and "SonicPods" or "Buy Online"
- metaDescription must mention price and include a call-to-action
- productDescription should be engaging, persuasive, highlight key audio features
- seoSlug should be URL-friendly, lowercase, hyphens only, no special characters

Return ONLY valid JSON, no explanations or markdown.`

  try {
    console.log("🤖 Generating SEO content with Groq AI (Llama 3.3)...")
    
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO copywriter specializing in consumer electronics and audio products. Always respond with valid JSON only, no markdown formatting or code blocks."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error("Groq API error:", response.status, error)
      return generateFallbackSEO(product)
    }

    const data = await response.json()
    
    const text = data.choices?.[0]?.message?.content
    
    if (!text) {
      console.error("No text in Groq response")
      return generateFallbackSEO(product)
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7)
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3)
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3)
    }
    cleanedText = cleanedText.trim()

    // Parse JSON
    const seoData = JSON.parse(cleanedText) as ProductSEO
    
    console.log("✅ SEO content generated successfully!")
    
    // Validate and sanitize
    return {
      metaTitle: sanitizeString(seoData.metaTitle, 60),
      metaDescription: sanitizeString(seoData.metaDescription, 160),
      metaKeywords: Array.isArray(seoData.metaKeywords) 
        ? seoData.metaKeywords.slice(0, 20).map(k => sanitizeString(k, 30))
        : [],
      ogTitle: sanitizeString(seoData.ogTitle, 70),
      ogDescription: sanitizeString(seoData.ogDescription, 200),
      ogType: "product",
      twitterTitle: sanitizeString(seoData.twitterTitle, 60),
      twitterDescription: sanitizeString(seoData.twitterDescription, 140),
      seoTitle: sanitizeString(seoData.seoTitle, 100),
      seoDescription: sanitizeString(seoData.seoDescription, 500),
      seoSlug: generateSlugFromText(seoData.seoSlug || product.name),
      schemaDescription: sanitizeString(seoData.schemaDescription, 500),
      productDescription: sanitizeString(seoData.productDescription, 1000),
    }
  } catch (error) {
    console.error("Error generating SEO with Groq:", error)
    return generateFallbackSEO(product)
  }
}

/**
 * Fallback SEO generation when Groq is unavailable
 */
function generateFallbackSEO(product: ProductInput): ProductSEO {
  const typeLabels: Record<string, string> = {
    wireless: "Wireless Earbuds",
    gaming: "Gaming Earbuds",
    anc: "ANC Earbuds",
  }
  const typeLabel = typeLabels[product.type] || "Earbuds"
  const brand = product.brand || "SonicPods"

  const metaTitle = `${product.name} | ${typeLabel} | Buy Online Pakistan`.slice(0, 60)
  const metaDescription = `Buy ${product.name} for Rs. ${product.price.toLocaleString()}. Premium ${typeLabel.toLowerCase()} with amazing sound quality. Free delivery across Pakistan! Shop now at SonicPods.`.slice(0, 160)
  
  const productDescription = `Experience exceptional audio quality with the ${product.name}. These premium ${typeLabel.toLowerCase()} deliver crystal-clear sound, powerful bass, and ultimate comfort for all-day wear. Whether you're commuting, working out, or relaxing at home, the ${product.name} provides an immersive listening experience. With cutting-edge Bluetooth technology, long battery life, and a sleek design, these earbuds are perfect for music lovers and professionals alike. Order now and enjoy free delivery across Pakistan.`

  return {
    metaTitle,
    metaDescription,
    metaKeywords: [
      product.name.toLowerCase(),
      product.type,
      brand.toLowerCase(),
      "wireless earbuds",
      "earpods pakistan",
      "buy earbuds online",
      "bluetooth earphones",
      typeLabel.toLowerCase(),
      "audio devices",
      "free delivery",
      "best earbuds",
      "online shopping pakistan",
      "sonicpods",
      "premium audio",
      "noise cancellation",
    ],
    ogTitle: `${product.name} - ${typeLabel} | SonicPods`,
    ogDescription: `Get the ${product.name} for Rs. ${product.price.toLocaleString()}. Premium audio quality with free delivery in Pakistan.`,
    ogType: "product",
    twitterTitle: `${product.name} | ${typeLabel}`,
    twitterDescription: `Rs. ${product.price.toLocaleString()} - Premium ${typeLabel.toLowerCase()}. Free delivery in Pakistan!`,
    seoTitle: `${product.name} - Premium ${typeLabel} for Audiophiles`,
    seoDescription: productDescription.slice(0, 300),
    seoSlug: generateSlugFromText(product.name),
    schemaDescription: productDescription.slice(0, 300),
    productDescription,
  }
}

/**
 * Generate URL-friendly slug
 */
function generateSlugFromText(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, 50)
}

/**
 * Sanitize string to specific length
 */
function sanitizeString(str: string, maxLength: number): string {
  if (!str || typeof str !== "string") return ""
  return str.trim().slice(0, maxLength)
}

/**
 * Generate product description using Groq AI for SonicPods
 */
export async function generateProductDescription(
  productName: string,
  productType: string,
  category: string,
  briefInfo?: string
): Promise<string | null> {
  const typeLabels: Record<string, string> = {
    wireless: "true wireless earbuds",
    gaming: "gaming earbuds with low latency",
    anc: "active noise cancelling earbuds",
  }

  // If no API key, generate a fallback description
  if (!GROQ_API_KEY) {
    const typeLabel = typeLabels[productType] || productType
    const fallbackDescription = `Experience premium audio with the ${productName}. These ${typeLabel} deliver exceptional sound quality, reliable connectivity, and all-day comfort. Whether you're streaming music, taking calls, or enjoying your favorite podcasts, the ${productName} provides the perfect audio companion for your lifestyle. Designed for quality and durability, these earbuds offer outstanding value for discerning audio enthusiasts.`
    return fallbackDescription
  }

  const prompt = `You are a copywriter for "SonicPods", a premium earpods store in Pakistan. Write a compelling product description for:

Product: ${productName}
Type: ${typeLabels[productType] || productType}
Category: ${category}
${briefInfo ? `Additional Info: ${briefInfo}` : ""}

Requirements:
- 3-4 sentences (80-150 words)
- Highlight key audio features (sound quality, battery life, connectivity, comfort)
- Use engaging, persuasive language
- Mention quality and expected experience
- Suitable for Pakistani audience
- Do NOT include the price
- Do NOT use asterisks, bullet points, or markdown
- Write in natural, flowing paragraph style

Return ONLY the description text, nothing else.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter for an audio/earpods store. Write concise, engaging product descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      // Fallback on API error
      const typeLabel = typeLabels[productType] || productType
      const fallbackDescription = `Experience premium audio with the ${productName}. These ${typeLabel} deliver exceptional sound quality, reliable connectivity, and all-day comfort. Whether you're streaming music, taking calls, or enjoying your favorite podcasts, the ${productName} provides the perfect audio companion for your lifestyle. Designed for quality and durability, these earbuds offer outstanding value for discerning audio enthusiasts.`
      return fallbackDescription
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    return text?.trim() || null
  } catch (error) {
    console.error("Error generating description:", error)
    // Fallback on exception
    const typeLabel = typeLabels[productType] || productType
    const fallbackDescription = `Experience premium audio with the ${productName}. These ${typeLabel} deliver exceptional sound quality, reliable connectivity, and all-day comfort. Whether you're streaming music, taking calls, or enjoying your favorite podcasts, the ${productName} provides the perfect audio companion for your lifestyle. Designed for quality and durability, these earbuds offer outstanding value for discerning audio enthusiasts.`
    return fallbackDescription
  }
}
