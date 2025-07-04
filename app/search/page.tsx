import { Suspense } from "react"
import { Header } from "@/components/header"
import { SearchResults } from "@/components/search-results"
import { SearchFilters } from "@/components/search-filters"
import { AIRecommendations } from "@/components/ai-recommendations"
import { Footer } from "@/components/footer"

interface SearchPageProps {
  searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {query ? `Search results for "${query}"` : "All Products"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare prices across multiple platforms and get AI-powered recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>

          <div className="lg:col-span-3 space-y-8">
            <Suspense fallback={<div className="animate-pulse">Loading AI recommendations...</div>}>
              <AIRecommendations query={query} />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse">Loading products...</div>}>
              <SearchResults searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
