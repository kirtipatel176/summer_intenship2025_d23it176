import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration - replace with your database implementation
const mockProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro 128GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    rating: 4.5,
    discount: 10,
    platforms: [
      { name: "Amazon", price: 134900, originalPrice: 149900, url: "https://amazon.in/dp/iphone15pro", inStock: true },
      {
        name: "Flipkart",
        price: 139900,
        originalPrice: 149900,
        url: "https://flipkart.com/iphone-15-pro",
        inStock: true,
      },
      {
        name: "Reliance Digital",
        price: 142900,
        originalPrice: 149900,
        url: "https://reliancedigital.in/iphone-15-pro",
        inStock: false,
      },
    ],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra 256GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    rating: 4.3,
    platforms: [
      {
        name: "Amazon",
        price: 124999,
        originalPrice: 139999,
        url: "https://amazon.in/dp/galaxys24ultra",
        inStock: true,
      },
      {
        name: "Flipkart",
        price: 119999,
        originalPrice: 139999,
        url: "https://flipkart.com/samsung-galaxy-s24-ultra",
        inStock: true,
      },
      {
        name: "Reliance Digital",
        price: 129999,
        originalPrice: 139999,
        url: "https://reliancedigital.in/samsung-galaxy-s24-ultra",
        inStock: true,
      },
    ],
  },
  {
    id: "3",
    name: "MacBook Air M3 13-inch 256GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Laptops",
    rating: 4.7,
    discount: 5,
    platforms: [
      { name: "Amazon", price: 114900, originalPrice: 119900, url: "https://amazon.in/dp/macbookairm3", inStock: true },
      {
        name: "Flipkart",
        price: 117900,
        originalPrice: 119900,
        url: "https://flipkart.com/macbook-air-m3",
        inStock: true,
      },
      { name: "Reliance Digital", price: 119900, url: "https://reliancedigital.in/macbook-air-m3", inStock: true },
    ],
  },
  {
    id: "4",
    name: "OnePlus 12 256GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    rating: 4.4,
    discount: 10,
    platforms: [
      { name: "Amazon", price: 64999, originalPrice: 69999, url: "https://amazon.in/dp/oneplus12", inStock: true },
      { name: "Flipkart", price: 62999, originalPrice: 69999, url: "https://flipkart.com/oneplus-12", inStock: true },
      {
        name: "Reliance Digital",
        price: 67999,
        originalPrice: 69999,
        url: "https://reliancedigital.in/oneplus-12",
        inStock: true,
      },
    ],
  },
  {
    id: "5",
    name: "Google Pixel 8 Pro 128GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    rating: 4.2,
    discount: 12,
    platforms: [
      { name: "Amazon", price: 89999, originalPrice: 99999, url: "https://amazon.in/dp/pixel8pro", inStock: true },
      {
        name: "Flipkart",
        price: 87999,
        originalPrice: 99999,
        url: "https://flipkart.com/google-pixel-8-pro",
        inStock: true,
      },
      {
        name: "Reliance Digital",
        price: 92999,
        originalPrice: 99999,
        url: "https://reliancedigital.in/google-pixel-8-pro",
        inStock: true,
      },
    ],
  },
  {
    id: "6",
    name: "Sony WH-1000XM5 Wireless Headphones",
    image: "/placeholder.svg?height=300&width=300",
    category: "Headphones",
    rating: 4.6,
    discount: 17,
    platforms: [
      { name: "Amazon", price: 24990, originalPrice: 29990, url: "https://amazon.in/dp/sonywh1000xm5", inStock: true },
      {
        name: "Flipkart",
        price: 26990,
        originalPrice: 29990,
        url: "https://flipkart.com/sony-wh1000xm5",
        inStock: true,
      },
      {
        name: "Reliance Digital",
        price: 28990,
        originalPrice: 29990,
        url: "https://reliancedigital.in/sony-wh1000xm5",
        inStock: true,
      },
    ],
  },
  {
    id: "7",
    name: "iPad Pro 12.9-inch M2 256GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Tablets",
    rating: 4.4,
    platforms: [
      { name: "Amazon", price: 89900, url: "https://amazon.in/dp/ipadprom2", inStock: true },
      { name: "Flipkart", price: 92900, url: "https://flipkart.com/ipad-pro-m2", inStock: true },
      { name: "Reliance Digital", price: 94900, url: "https://reliancedigital.in/ipad-pro-m2", inStock: true },
    ],
  },
  {
    id: "8",
    name: "Dell XPS 13 Plus Intel i7 512GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Laptops",
    rating: 4.3,
    platforms: [
      { name: "Amazon", price: 149999, url: "https://amazon.in/dp/dellxps13plus", inStock: true },
      { name: "Flipkart", price: 152999, url: "https://flipkart.com/dell-xps-13-plus", inStock: true },
      { name: "Reliance Digital", price: 154999, url: "https://reliancedigital.in/dell-xps-13-plus", inStock: true },
    ],
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const sort = searchParams.get("sort") || "relevance"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredProducts = [...mockProducts]

    // Apply search query filter
    if (query) {
      const searchTerm = query.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm),
      )
    }

    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    // Apply price filters
    if (minPrice || maxPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        const lowestPrice = Math.min(...product.platforms.map((p) => p.price))
        const minPriceNum = minPrice ? Number.parseInt(minPrice) : 0
        const maxPriceNum = maxPrice ? Number.parseInt(maxPrice) : Number.POSITIVE_INFINITY
        return lowestPrice >= minPriceNum && lowestPrice <= maxPriceNum
      })
    }

    // Apply sorting
    switch (sort) {
      case "price-low":
        filteredProducts.sort((a, b) => {
          const aPrice = Math.min(...a.platforms.map((p) => p.price))
          const bPrice = Math.min(...b.platforms.map((p) => p.price))
          return aPrice - bPrice
        })
        break
      case "price-high":
        filteredProducts.sort((a, b) => {
          const aPrice = Math.min(...a.platforms.map((p) => p.price))
          const bPrice = Math.min(...b.platforms.map((p) => p.price))
          return bPrice - aPrice
        })
        break
      case "rating":
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "discount":
        filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      default:
        // Keep original order for relevance
        break
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      query,
      filters: { category, minPrice, maxPrice, sort },
      hasMore: endIndex < filteredProducts.length,
    })
  } catch (error) {
    console.error("Error searching products:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
