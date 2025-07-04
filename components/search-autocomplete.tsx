"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchSuggestion {
  id: string
  title: string
  category: string
  trending?: boolean
}

export function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  // Mock suggestions - in real app, fetch from API
  const mockSuggestions: SearchSuggestion[] = [
    { id: "1", title: "iPhone 15 Pro", category: "Smartphones", trending: true },
    { id: "2", title: "Samsung Galaxy S24", category: "Smartphones" },
    { id: "3", title: "MacBook Air M3", category: "Laptops", trending: true },
    { id: "4", title: "Sony WH-1000XM5", category: "Headphones" },
    { id: "5", title: "iPad Pro 12.9", category: "Tablets" },
    { id: "6", title: "OnePlus 12", category: "Smartphones" },
    { id: "7", title: "Google Pixel 8 Pro", category: "Smartphones" },
    { id: "8", title: "Dell XPS 13", category: "Laptops" },
  ]

  useEffect(() => {
    if (query.length > 1) {
      setIsLoading(true)
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase()),
        )
        setSuggestions(filtered)
        setIsOpen(true)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setIsOpen(false)
      setIsLoading(false)
    }
  }, [query])

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      setIsOpen(false)
      setQuery("")
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSearch(suggestions[selectedIndex].title)
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.title)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          onBlur={() => {
            // Delay closing to allow click events on suggestions
            setTimeout(() => setIsOpen(false), 200)
          }}
          className="pl-10 pr-20 h-12 text-base"
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? "..." : "Search"}
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
                index === selectedIndex ? "bg-gray-50 dark:bg-gray-700" : ""
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{suggestion.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">in {suggestion.category}</div>
              </div>
              {suggestion.trending && (
                <div className="flex items-center text-orange-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs">Trending</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length > 1 && suggestions.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 z-50 p-4 text-center text-gray-500 dark:text-gray-400">
          No products found for "{query}"
        </div>
      )}
    </div>
  )
}
