"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState([0, 200000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])

  const categories = [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Headphones",
    "Smartwatches",
    "Cameras",
    "Gaming",
    "Home Appliances",
  ]

  const platforms = ["Amazon", "Flipkart", "Reliance Digital"]
  const ratings = ["4+ Stars", "3+ Stars", "2+ Stars"]

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    if (category) {
      setSelectedCategories([category])
    }

    if (minPrice || maxPrice) {
      setPriceRange([minPrice ? Number.parseInt(minPrice) : 0, maxPrice ? Number.parseInt(maxPrice) : 200000])
    }
  }, [searchParams])

  const updateURL = (filters: {
    categories?: string[]
    platforms?: string[]
    ratings?: string[]
    priceRange?: number[]
  }) => {
    const url = new URL(window.location.href)

    // Preserve existing search query
    const currentQuery = searchParams.get("q")
    if (currentQuery) {
      url.searchParams.set("q", currentQuery)
    }

    // Update category
    if (filters.categories && filters.categories.length > 0) {
      url.searchParams.set("category", filters.categories[0])
    } else {
      url.searchParams.delete("category")
    }

    // Update price range
    if (filters.priceRange) {
      if (filters.priceRange[0] > 0) {
        url.searchParams.set("minPrice", filters.priceRange[0].toString())
      } else {
        url.searchParams.delete("minPrice")
      }

      if (filters.priceRange[1] < 200000) {
        url.searchParams.set("maxPrice", filters.priceRange[1].toString())
      } else {
        url.searchParams.delete("maxPrice")
      }
    }

    router.push(url.toString())
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newCategories: string[]
    if (checked) {
      newCategories = [category] // Only allow one category for now
      setSelectedCategories(newCategories)
    } else {
      newCategories = selectedCategories.filter((c) => c !== category)
      setSelectedCategories(newCategories)
    }

    updateURL({ categories: newCategories })
  }

  const handlePlatformChange = (platform: string, checked: boolean) => {
    let newPlatforms: string[]
    if (checked) {
      newPlatforms = [...selectedPlatforms, platform]
    } else {
      newPlatforms = selectedPlatforms.filter((p) => p !== platform)
    }
    setSelectedPlatforms(newPlatforms)
    updateURL({ platforms: newPlatforms })
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    let newRatings: string[]
    if (checked) {
      newRatings = [...selectedRatings, rating]
    } else {
      newRatings = selectedRatings.filter((r) => r !== rating)
    }
    setSelectedRatings(newRatings)
    updateURL({ ratings: newRatings })
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange)
  }

  const applyPriceFilter = () => {
    updateURL({ priceRange })
  }

  const clearAllFilters = () => {
    setPriceRange([0, 200000])
    setSelectedCategories([])
    setSelectedPlatforms([])
    setSelectedRatings([])

    const url = new URL(window.location.href)
    const currentQuery = searchParams.get("q")

    // Clear all params except search query
    url.search = ""
    if (currentQuery) {
      url.searchParams.set("q", currentQuery)
    }

    router.push(url.toString())
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </div>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Price Range</Label>
          <Slider value={priceRange} onValueChange={handlePriceRangeChange} max={200000} step={1000} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
          <Button size="sm" onClick={applyPriceFilter} className="w-full">
            Apply Price Filter
          </Button>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Categories</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <Label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Platforms */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Platforms</Label>
          <div className="space-y-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={selectedPlatforms.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                />
                <Label htmlFor={platform} className="text-sm cursor-pointer">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Ratings */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Customer Rating</Label>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={rating}
                  checked={selectedRatings.includes(rating)}
                  onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                />
                <Label htmlFor={rating} className="text-sm cursor-pointer">
                  {rating}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
