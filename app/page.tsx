import { Header } from "@/components/header"
import { SearchSection } from "@/components/search-section"
import { FeaturedDeals } from "@/components/featured-deals"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main>
        <SearchSection />
        <FeaturedDeals />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
