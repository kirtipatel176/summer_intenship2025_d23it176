import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro 128GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    rating: 4.5,
    discount: 10,
    platforms: [
      { name: "Amazon", price: 134900, originalPrice: 149900, url: "#", inStock: true },
      { name: "Flipkart", price: 139900, originalPrice: 149900, url: "#", inStock: true },
      { name: "Reliance Digital", price: 142900, originalPrice: 149900, url: "#", inStock: false },
    ],
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra 256GB",
    image: "/placeholder.svg?height=300&width=300",
    category: "Smartphones",
    rating: 4.3,
    platforms: [
      { name: "Amazon", price: 124999, url: "#", inStock: true },
      { name: "Flipkart", price: 119999, url: "#", inStock: true },
      { name: "Reliance Digital", price: 129999, url: "#", inStock: true },
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
      { name: "Amazon", price: 114900, originalPrice: 119900, url: "#", inStock: true },
      { name: "Flipkart", price: 117900, originalPrice: 119900, url: "#", inStock: true },
      { name: "Reliance Digital", price: 119900, url: "#", inStock: true },
    ],
  },
]

export function FeaturedDeals() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Deals</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Handpicked deals with the best prices and AI-verified value for money
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
