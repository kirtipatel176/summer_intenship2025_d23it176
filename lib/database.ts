import { createServerClient } from "./supabase"

const supabase = createServerClient()

export async function searchProducts(params: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  let query = supabase.from("products").select(`
      *,
      product_prices (
        price,
        original_price,
        discount_percentage,
        product_url,
        in_stock,
        platforms (name, logo_url)
      )
    `)

  // Apply filters
  if (params.query) {
    query = query.or(`name.ilike.%${params.query}%,description.ilike.%${params.query}%`)
  }

  if (params.category) {
    query = query.eq("category", params.category)
  }

  // Apply sorting
  switch (params.sort) {
    case "price-low":
      query = query.order("product_prices.price", { ascending: true })
      break
    case "price-high":
      query = query.order("product_prices.price", { ascending: false })
      break
    case "rating":
      query = query.order("rating", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to search products")
  }

  return data
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_prices (
        price,
        original_price,
        discount_percentage,
        product_url,
        in_stock,
        platforms (name, logo_url)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to get product")
  }

  return data
}

export async function getPriceHistory(productId: string, days = 90) {
  const { data, error } = await supabase
    .from("price_history")
    .select(`
      price,
      original_price,
      recorded_at,
      platforms (name)
    `)
    .eq("product_id", productId)
    .gte("recorded_at", new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order("recorded_at", { ascending: true })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to get price history")
  }

  return data
}

export async function createPriceAlert(alert: {
  userId: string
  productId: string
  platformId?: string
  targetPrice: number
}) {
  const { data, error } = await supabase.from("price_alerts").insert([alert]).select().single()

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create price alert")
  }

  return data
}

export async function getUserPriceAlerts(userId: string) {
  const { data, error } = await supabase
    .from("price_alerts")
    .select(`
      *,
      products (name, image_url),
      platforms (name)
    `)
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database error:", error)
    throw new Error("Failed to get price alerts")
  }

  return data
}

export async function createUser(email: string, name?: string) {
  const { data, error } = await supabase.from("users").insert([{ email, name }]).select().single()

  if (error) {
    // If user already exists, return existing user
    if (error.code === "23505") {
      const { data: existingUser } = await supabase.from("users").select().eq("email", email).single()
      return existingUser
    }
    console.error("Database error:", error)
    throw new Error("Failed to create user")
  }

  return data
}

export async function updateProductPrices(
  productId: string,
  prices: {
    platformId: string
    price: number
    originalPrice?: number
    productUrl: string
    inStock: boolean
  }[],
) {
  // Insert current prices
  const { error: pricesError } = await supabase.from("product_prices").upsert(
    prices.map((p) => ({
      product_id: productId,
      platform_id: p.platformId,
      price: p.price,
      original_price: p.originalPrice,
      discount_percentage: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null,
      product_url: p.productUrl,
      in_stock: p.inStock,
      last_updated: new Date().toISOString(),
    })),
    { onConflict: "product_id,platform_id" },
  )

  if (pricesError) {
    console.error("Error updating prices:", pricesError)
    throw new Error("Failed to update product prices")
  }

  // Insert price history
  const { error: historyError } = await supabase.from("price_history").insert(
    prices.map((p) => ({
      product_id: productId,
      platform_id: p.platformId,
      price: p.price,
      original_price: p.originalPrice,
      discount_percentage: p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null,
      in_stock: p.inStock,
    })),
  )

  if (historyError) {
    console.error("Error inserting price history:", historyError)
    // Don't throw error for history insertion failure
  }
}
