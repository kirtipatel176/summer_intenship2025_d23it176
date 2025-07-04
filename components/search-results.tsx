"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"

interface SearchResultsProps {
  searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string }
}

export function SearchResults({ searchParams }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = async (pageNum = 1, append = false) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchParams.q) params.set("q", searchParams.q)
      if (searchParams.category) params.set("category", searchParams.category)
      if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice)
      if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice)
      if (searchParams.sort) params.set("sort", searchParams.sort)
      params.set("page", pageNum.toString())
      params.set("limit", "12")

      const response = await fetch(`/api/products/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()

      if (append) {
        setProducts((prev) => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }

      setHasMore(data.products.length === 12) // If we got less than 12, no more pages
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again.")

      // Fallback to mock data
      if (!append) {
        setProducts([
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
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchProducts(1, false)
  }, [searchParams.q, searchParams.category, searchParams.minPrice, searchParams.maxPrice, searchParams.sort])

  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href)
    if (value === "relevance") {
      url.searchParams.delete("sort")
    } else {
      url.searchParams.set("sort", value)
    }
    window.history.pushState({}, "", url.toString())
    window.location.reload()
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage, true)
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{products.length} Products Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {searchParams.q ? `Showing results for "${searchParams.q}"` : "All products"}
          </p>
        </div>

        <Select defaultValue={searchParams.sort || "relevance"} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Most Relevant</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="discount">Best Discount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" onClick={handleLoadMore} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Products"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No products found. Try adjusting your search or filters.
            </p>
          </div>
        )
      )}
    </div>
  )
}
