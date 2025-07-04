import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const productId = params.productId
    const searchParams = request.nextUrl.searchParams
    const days = Number.parseInt(searchParams.get("days") || "90")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock price history data
    const mockPriceHistory = [
      { date: "2024-01-01", amazon: 149900, flipkart: 152900, relianceDigital: 154900 },
      { date: "2024-01-15", amazon: 147900, flipkart: 149900, relianceDigital: 152900 },
      { date: "2024-02-01", amazon: 144900, flipkart: 147900, relianceDigital: 149900 },
      { date: "2024-02-15", amazon: 139900, flipkart: 142900, relianceDigital: 147900 },
      { date: "2024-03-01", amazon: 134900, flipkart: 139900, relianceDigital: 142900 },
      { date: "2024-03-15", amazon: 134900, flipkart: 139900, relianceDigital: 142900 },
    ]

    // Customize based on product
    let priceHistory = mockPriceHistory
    if (productId === "2") {
      // Samsung Galaxy S24 Ultra
      priceHistory = [
        { date: "2024-01-01", amazon: 139999, flipkart: 142999, relianceDigital: 144999 },
        { date: "2024-01-15", amazon: 134999, flipkart: 137999, relianceDigital: 139999 },
        { date: "2024-02-01", amazon: 129999, flipkart: 132999, relianceDigital: 134999 },
        { date: "2024-02-15", amazon: 124999, flipkart: 127999, relianceDigital: 129999 },
        { date: "2024-03-01", amazon: 124999, flipkart: 119999, relianceDigital: 129999 },
        { date: "2024-03-15", amazon: 124999, flipkart: 119999, relianceDigital: 129999 },
      ]
    }

    // Find lowest price
    const allPrices = priceHistory.flatMap((entry) => [entry.amazon, entry.flipkart, entry.relianceDigital])
    const lowestPrice = Math.min(...allPrices)

    // Find which platform and date had the lowest price
    let lowestPriceDate = ""
    let lowestPricePlatform = ""

    for (const entry of priceHistory) {
      if (entry.amazon === lowestPrice) {
        lowestPriceDate = entry.date
        lowestPricePlatform = "Amazon"
        break
      } else if (entry.flipkart === lowestPrice) {
        lowestPriceDate = entry.date
        lowestPricePlatform = "Flipkart"
        break
      } else if (entry.relianceDigital === lowestPrice) {
        lowestPriceDate = entry.date
        lowestPricePlatform = "Reliance Digital"
        break
      }
    }

    return NextResponse.json({
      productId,
      priceHistory,
      lowestPrice,
      lowestPriceDate,
      lowestPricePlatform,
      days,
    })
  } catch (error) {
    console.error("Error fetching price history:", error)
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 })
  }
}
