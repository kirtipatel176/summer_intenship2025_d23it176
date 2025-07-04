"use client"

import { useRouter } from "next/navigation"
import { SearchAutocomplete } from "./search-autocomplete"
import { TrendingUp, Zap, Shield, Brain } from "lucide-react"

export function SearchSection() {
  const router = useRouter()

  const trendingSearches = [
    "iPhone 15 Pro",
    "Samsung Galaxy S24",
    "MacBook Air M3",
    "Sony WH-1000XM5",
    "OnePlus 12",
    "Google Pixel 8 Pro",
  ]

  const handleTrendingClick = (search: string) => {
    router.push(`/search?q=${encodeURIComponent(search)}`)
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Smart Shopping with
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> AI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Compare prices across Amazon, Flipkart, and Reliance Digital. Get AI-powered recommendations and never miss a
          great deal again.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchAutocomplete />
        </div>

        {/* Trending Searches */}
        <div className="mb-16">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Trending searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {trendingSearches.map((search) => (
              <button
                key={search}
                onClick={() => handleTrendingClick(search)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Track price history and get alerts when prices drop
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Comparison</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Compare prices across multiple platforms instantly
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Recommendations</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Get smart buying advice powered by AI</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Best Deals</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Never miss the best deals and discounts</p>
          </div>
        </div>
      </div>
    </section>
  )
}
