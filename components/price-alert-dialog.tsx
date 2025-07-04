"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface PriceAlertDialogProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function PriceAlertDialog({ product, isOpen, onClose }: PriceAlertDialogProps) {
  const [email, setEmail] = useState("")
  const [targetPrice, setTargetPrice] = useState("")
  const [platform, setPlatform] = useState("any")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const currentLowestPrice = Math.min(...product.platforms.map((p) => p.price))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !targetPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseInt(targetPrice)
    if (price >= currentLowestPrice) {
      toast({
        title: "Invalid Price",
        description: `Target price should be lower than current lowest price (₹${currentLowestPrice.toLocaleString()})`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/price-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          email,
          targetPrice: price,
          platform: platform === "any" ? null : platform,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create price alert")
      }

      const data = await response.json()

      toast({
        title: "Price Alert Set!",
        description:
          data.message || `We'll notify you when ${product.name} drops to ₹${price.toLocaleString()} or below.`,
      })

      onClose()
      setEmail("")
      setTargetPrice("")
      setPlatform("any")
    } catch (error) {
      console.error("Error creating price alert:", error)
      toast({
        title: "Error",
        description: "Failed to create price alert. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Set Price Alert
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product-name">Product</Label>
            <Input id="product-name" value={product.name} disabled className="bg-gray-50 dark:bg-gray-800" />
          </div>

          <div>
            <Label htmlFor="current-price">Current Lowest Price</Label>
            <Input
              id="current-price"
              value={`₹${currentLowestPrice.toLocaleString()}`}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="target-price">Target Price (₹)</Label>
            <Input
              id="target-price"
              type="number"
              placeholder="Enter your target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Platform</SelectItem>
                {product.platforms.map((p) => (
                  <SelectItem key={p.name} value={p.name.toLowerCase()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Setting Alert...
                </>
              ) : (
                "Set Alert"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
