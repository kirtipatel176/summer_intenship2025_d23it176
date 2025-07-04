import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

// Neon Database Operations
export async function searchProducts(params: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  let query = `
    SELECT p.*, 
           json_agg(
             json_build_object(
               'name', pl.name,
               'price', pp.price,
               'originalPrice', pp.original_price,
               'url', pp.product_url,
               'inStock', pp.in_stock
             )
           ) as platforms
    FROM products p
    LEFT JOIN product_prices pp ON p.id = pp.product_id
    LEFT JOIN platforms pl ON pp.platform_id = pl.id
    WHERE p.is_active = true
  `

  const conditions = []
  const values = []
  let paramCount = 0

  if (params.query) {
    paramCount++
    conditions.push(
      `(p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.brand ILIKE $${paramCount})`,
    )
    values.push(`%${params.query}%`)
  }

  if (params.category) {
    paramCount++
    conditions.push(`p.category = $${paramCount}`)
    values.push(params.category)
  }

  if (params.minPrice) {
    paramCount++
    conditions.push(`pp.price >= $${paramCount}`)
    values.push(params.minPrice)
  }

  if (params.maxPrice) {
    paramCount++
    conditions.push(`pp.price <= $${paramCount}`)
    values.push(params.maxPrice)
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ")
  }

  query += " GROUP BY p.id"

  // Add sorting
  switch (params.sort) {
    case "price-low":
      query += " ORDER BY MIN(pp.price) ASC"
      break
    case "price-high":
      query += " ORDER BY MIN(pp.price) DESC"
      break
    case "rating":
      query += " ORDER BY p.rating DESC"
      break
    default:
      query += " ORDER BY p.created_at DESC"
  }

  if (params.limit) {
    paramCount++
    query += ` LIMIT $${paramCount}`
    values.push(params.limit)

    if (params.offset) {
      paramCount++
      query += ` OFFSET $${paramCount}`
      values.push(params.offset)
    }
  }

  const results = await sql(query, values)
  return results
}

export async function getProductById(id: string) {
  const query = `
    SELECT p.*, 
           json_agg(
             json_build_object(
               'name', pl.name,
               'price', pp.price,
               'originalPrice', pp.original_price,
               'url', pp.product_url,
               'inStock', pp.in_stock
             )
           ) as platforms
    FROM products p
    LEFT JOIN product_prices pp ON p.id = pp.product_id
    LEFT JOIN platforms pl ON pp.platform_id = pl.id
    WHERE p.id = $1 AND p.is_active = true
    GROUP BY p.id
  `

  const results = await sql(query, [id])
  return results[0] || null
}

export async function getPriceHistory(productId: string, days = 90) {
  const query = `
    SELECT ph.*, pl.name as platform_name
    FROM price_history ph
    JOIN platforms pl ON ph.platform_id = pl.id
    WHERE ph.product_id = $1 
    AND ph.recorded_at >= NOW() - INTERVAL '${days} days'
    ORDER BY ph.recorded_at ASC
  `

  const results = await sql(query, [productId])
  return results
}

export async function createPriceAlert(alert: {
  userId: string
  productId: string
  platformId?: string
  targetPrice: number
}) {
  const query = `
    INSERT INTO price_alerts (user_id, product_id, platform_id, target_price, is_active, created_at)
    VALUES ($1, $2, $3, $4, true, NOW())
    RETURNING *
  `

  const results = await sql(query, [alert.userId, alert.productId, alert.platformId || null, alert.targetPrice])

  return results[0]
}

export async function createUser(email: string, name?: string) {
  const query = `
    INSERT INTO users (email, name, created_at, updated_at)
    VALUES ($1, $2, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = NOW()
    RETURNING *
  `

  const results = await sql(query, [email, name || null])
  return results[0]
}
