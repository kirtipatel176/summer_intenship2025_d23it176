import { connect } from "@planetscale/database"

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
}

export const conn = connect(config)

// PlanetScale Database Operations
export async function searchProducts(params: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  let sql = `
    SELECT p.*, 
           GROUP_CONCAT(
             JSON_OBJECT(
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
    WHERE p.is_active = 1
  `

  const conditions = []
  const values = []

  if (params.query) {
    conditions.push("(p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)")
    const searchTerm = `%${params.query}%`
    values.push(searchTerm, searchTerm, searchTerm)
  }

  if (params.category) {
    conditions.push("p.category = ?")
    values.push(params.category)
  }

  if (params.minPrice) {
    conditions.push("pp.price >= ?")
    values.push(params.minPrice)
  }

  if (params.maxPrice) {
    conditions.push("pp.price <= ?")
    values.push(params.maxPrice)
  }

  if (conditions.length > 0) {
    sql += " AND " + conditions.join(" AND ")
  }

  sql += " GROUP BY p.id"

  // Add sorting
  switch (params.sort) {
    case "price-low":
      sql += " ORDER BY MIN(pp.price) ASC"
      break
    case "price-high":
      sql += " ORDER BY MIN(pp.price) DESC"
      break
    case "rating":
      sql += " ORDER BY p.rating DESC"
      break
    default:
      sql += " ORDER BY p.created_at DESC"
  }

  if (params.limit) {
    sql += ` LIMIT ${params.limit}`
    if (params.offset) {
      sql += ` OFFSET ${params.offset}`
    }
  }

  const results = await conn.execute(sql, values)
  return results.rows.map((row: any) => ({
    ...row,
    platforms: row.platforms ? JSON.parse(`[${row.platforms}]`) : [],
  }))
}

export async function getProductById(id: string) {
  const sql = `
    SELECT p.*, 
           GROUP_CONCAT(
             JSON_OBJECT(
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
    WHERE p.id = ? AND p.is_active = 1
    GROUP BY p.id
  `

  const results = await conn.execute(sql, [id])
  const row = results.rows[0] as any

  if (!row) return null

  return {
    ...row,
    platforms: row.platforms ? JSON.parse(`[${row.platforms}]`) : [],
  }
}

export async function getPriceHistory(productId: string, days = 90) {
  const sql = `
    SELECT ph.*, pl.name as platform_name
    FROM price_history ph
    JOIN platforms pl ON ph.platform_id = pl.id
    WHERE ph.product_id = ? 
    AND ph.recorded_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    ORDER BY ph.recorded_at ASC
  `

  const results = await conn.execute(sql, [productId, days])
  return results.rows
}

export async function createPriceAlert(alert: {
  userId: string
  productId: string
  platformId?: string
  targetPrice: number
}) {
  const sql = `
    INSERT INTO price_alerts (user_id, product_id, platform_id, target_price, is_active, created_at)
    VALUES (?, ?, ?, ?, 1, NOW())
  `

  const result = await conn.execute(sql, [alert.userId, alert.productId, alert.platformId || null, alert.targetPrice])

  return { id: result.insertId, ...alert, isActive: true, createdAt: new Date() }
}

export async function createUser(email: string, name?: string) {
  // Check if user exists
  const checkSql = "SELECT * FROM users WHERE email = ?"
  const existing = await conn.execute(checkSql, [email])

  if (existing.rows.length > 0) {
    return existing.rows[0]
  }

  // Create new user
  const insertSql = "INSERT INTO users (email, name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())"
  const result = await conn.execute(insertSql, [email, name || null])

  return { id: result.insertId, email, name, createdAt: new Date(), updatedAt: new Date() }
}
