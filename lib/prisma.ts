import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Prisma Database Operations
export async function searchProducts(params: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  const where: any = { isActive: true }

  if (params.query) {
    where.OR = [
      { name: { contains: params.query, mode: "insensitive" } },
      { description: { contains: params.query, mode: "insensitive" } },
      { brand: { contains: params.query, mode: "insensitive" } },
    ]
  }

  if (params.category) {
    where.category = params.category
  }

  if (params.minPrice || params.maxPrice) {
    where.platforms = {
      some: {
        price: {
          ...(params.minPrice && { gte: params.minPrice }),
          ...(params.maxPrice && { lte: params.maxPrice }),
        },
      },
    }
  }

  let orderBy: any = { createdAt: "desc" }
  switch (params.sort) {
    case "price-low":
      orderBy = { platforms: { _min: { price: "asc" } } }
      break
    case "price-high":
      orderBy = { platforms: { _min: { price: "desc" } } }
      break
    case "rating":
      orderBy = { rating: "desc" }
      break
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
    },
    orderBy,
    skip: params.offset || 0,
    take: params.limit || 12,
  })

  return products
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    include: {
      platforms: {
        include: {
          platform: true,
        },
      },
    },
  })

  return product
}

export async function getPriceHistory(productId: string, days = 90) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const history = await prisma.priceHistory.findMany({
    where: {
      productId,
      recordedAt: { gte: startDate },
    },
    include: {
      platform: true,
    },
    orderBy: { recordedAt: "asc" },
  })

  return history
}

export async function createPriceAlert(alert: {
  userId: string
  productId: string
  platformId?: string
  targetPrice: number
}) {
  const newAlert = await prisma.priceAlert.create({
    data: {
      ...alert,
      isActive: true,
    },
  })

  return newAlert
}

export async function createUser(email: string, name?: string) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  })

  return user
}
