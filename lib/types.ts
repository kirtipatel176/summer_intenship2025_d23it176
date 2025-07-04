export interface Product {
  id: string
  name: string
  image: string
  category: string
  rating?: number
  discount?: number
  platforms: Platform[]
}

export interface Platform {
  name: string
  price: number
  originalPrice?: number
  url: string
  inStock: boolean
}

export interface PriceHistory {
  id: string
  productId: string
  platform: string
  price: number
  date: string
}

export interface PriceAlert {
  id: string
  productId: string
  email: string
  targetPrice: number
  platform: string
  isActive: boolean
  createdAt: string
}

export interface AIRecommendation {
  productId: string
  recommendation: "buy_now" | "wait" | "alternative"
  confidence: number
  reasoning: string[]
  alternativeProducts?: string[]
}
