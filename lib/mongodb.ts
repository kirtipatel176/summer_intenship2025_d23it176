import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("dealsense")
}

// MongoDB Database Operations
export async function searchProducts(params: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  const db = await getDatabase()
  const collection = db.collection("products")

  const filter: any = { isActive: true }

  // Apply filters
  if (params.query) {
    filter.$or = [
      { name: { $regex: params.query, $options: "i" } },
      { description: { $regex: params.query, $options: "i" } },
      { brand: { $regex: params.query, $options: "i" } },
    ]
  }

  if (params.category) {
    filter.category = params.category
  }

  if (params.minPrice || params.maxPrice) {
    filter["platforms.price"] = {}
    if (params.minPrice) filter["platforms.price"].$gte = params.minPrice
    if (params.maxPrice) filter["platforms.price"].$lte = params.maxPrice
  }

  // Apply sorting
  let sort: any = { createdAt: -1 }
  switch (params.sort) {
    case "price-low":
      sort = { "platforms.price": 1 }
      break
    case "price-high":
      sort = { "platforms.price": -1 }
      break
    case "rating":
      sort = { rating: -1 }
      break
  }

  const products = await collection
    .find(filter)
    .sort(sort)
    .skip(params.offset || 0)
    .limit(params.limit || 12)
    .toArray()

  return products
}

export async function getProductById(id: string) {
  const db = await getDatabase()
  const collection = db.collection("products")

  const product = await collection.findOne({ _id: id, isActive: true })
  return product
}

export async function getPriceHistory(productId: string, days = 90) {
  const db = await getDatabase()
  const collection = db.collection("priceHistory")

  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const history = await collection
    .find({
      productId,
      recordedAt: { $gte: startDate },
    })
    .sort({ recordedAt: 1 })
    .toArray()

  return history
}

export async function createPriceAlert(alert: {
  userId: string
  productId: string
  platformId?: string
  targetPrice: number
  email: string
}) {
  const db = await getDatabase()
  const collection = db.collection("priceAlerts")

  const newAlert = {
    ...alert,
    isActive: true,
    createdAt: new Date(),
    triggeredAt: null,
  }

  const result = await collection.insertOne(newAlert)
  return { ...newAlert, _id: result.insertedId }
}

export async function createUser(email: string, name?: string) {
  const db = await getDatabase()
  const collection = db.collection("users")

  // Check if user exists
  const existingUser = await collection.findOne({ email })
  if (existingUser) {
    return existingUser
  }

  const newUser = {
    email,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await collection.insertOne(newUser)
  return { ...newUser, _id: result.insertedId }
}
