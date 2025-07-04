import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query, productId } = await request.json()

    if (!productId && !query) {
      return NextResponse.json({ error: "Product ID or query is required" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock AI recommendations based on query
    const mockRecommendations = [
      {
        type: "buy_now",
        title: "Great time to buy!",
        description: "Prices are competitive and stable across platforms.",
        confidence: 85,
        reasoning: [
          "Current prices are within normal range",
          "Good availability across all platforms",
          "No major price drops expected in near future",
        ],
        bestPlatform: "Amazon",
        estimatedSavings: 5000,
      },
    ]

    // Customize recommendations based on query
    if (query?.toLowerCase().includes("iphone")) {
      mockRecommendations[0] = {
        type: "buy_now",
        title: "Excellent deal available!",
        description: "iPhone prices have dropped significantly. Amazon offers the best current deal.",
        confidence: 92,
        reasoning: [
          "Price dropped 10% in the last month",
          "Historical data shows this is near the lowest price",
          "High demand expected during upcoming festival season",
        ],
        bestPlatform: "Amazon",
        estimatedSavings: 15000,
      }
    } else if (query?.toLowerCase().includes("samsung")) {
      mockRecommendations[0] = {
        type: "alternative",
        title: "Consider waiting or alternatives",
        description: "Samsung Galaxy prices may drop further. Consider OnePlus 12 as an alternative.",
        confidence: 78,
        reasoning: [
          "New Samsung models launching soon",
          "Current inventory levels are high",
          "OnePlus 12 offers similar features at lower price",
        ],
        bestPlatform: "Flipkart",
        estimatedSavings: 20000,
      }
    } else if (query?.toLowerCase().includes("macbook")) {
      mockRecommendations[0] = {
        type: "buy_now",
        title: "Perfect timing!",
        description: "MacBook Air M3 is at its lowest price in 6 months.",
        confidence: 88,
        reasoning: [
          "Lowest price in 6 months",
          "New model not expected until next year",
          "Educational discounts may end soon",
        ],
        bestPlatform: "Amazon",
        estimatedSavings: 5000,
      }
    }

    return NextResponse.json({
      recommendations: mockRecommendations,
      query: query || "Product search",
      productId,
    })
  } catch (error) {
    console.error("Error getting AI recommendations:", error)
    return NextResponse.json({ error: "Failed to get AI recommendations" }, { status: 500 })
  }
}
