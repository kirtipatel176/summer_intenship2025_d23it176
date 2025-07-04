"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Heart, TrendingDown, ExternalLink, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PriceHistoryChart } from "./price-history-chart"
import { PriceAlertDialog } from "./price-alert-dialog"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showPriceHistory, setShowPriceHistory] = useState(false)
  const [showPriceAlert, setShowPriceAlert] = useState(false)

  const lowestPrice = Math.min(...product.platforms.map((p) => p.price))
  const highestPrice = Math.max(...product.platforms.map((p) => p.price))
  const savings = highestPrice - lowestPrice

  const bestDeal = product.platforms.find((p) => p.price === lowestPrice)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
              onClick={() => setShowPriceAlert(true)}
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
          {product.discount && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.rating})</span>
            </div>
          )}

          {/* Price Comparison */}
          <div className="space-y-2 mb-4">
            {product.platforms.map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={`/platforms/${platform.name.toLowerCase()}.png`}
                    alt={platform.name}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">{platform.name}</span>
                  {platform.price === lowestPrice && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Best Price
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{platform.price.toLocaleString()}</span>
                  {platform.originalPrice && platform.originalPrice > platform.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{platform.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Savings Info */}
          {savings > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Save up to ₹{savings.toLocaleString()} by choosing {bestDeal?.name}
                </span>
              </div>
            </div>
          )}

          {/* Price History */}
          <Button
            variant="outline"
            size="sm"
            className="w-full mb-3 bg-transparent"
            onClick={() => setShowPriceHistory(!showPriceHistory)}
          >
            {showPriceHistory ? "Hide" : "Show"} Price History
          </Button>

          {showPriceHistory && (
            <div className="mb-4">
              <PriceHistoryChart productId={product.id} />
            </div>
          )}

          {/* Buy Buttons */}
          <div className="space-y-2">
            {product.platforms.map((platform) => (
              <Button
                key={platform.name}
                variant={platform.price === lowestPrice ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Buy on {platform.name}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <PriceAlertDialog product={product} isOpen={showPriceAlert} onClose={() => setShowPriceAlert(false)} />
    </Card>
  )
}
