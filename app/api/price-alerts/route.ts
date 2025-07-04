import { type NextRequest, NextResponse } from "next/server"

// Mock storage for price alerts (in production, use a database)
const priceAlerts: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { productId, email, targetPrice, platform } = await request.json()

    // Validate input
    if (!productId || !email || !targetPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (typeof targetPrice !== "number" || targetPrice <= 0) {
      return NextResponse.json({ error: "Invalid target price" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create price alert
    const alert = {
      id: Date.now().toString(),
      productId,
      email,
      targetPrice,
      platform: platform || "any",
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    priceAlerts.push(alert)

    return NextResponse.json({
      success: true,
      alert,
      message: `Price alert set successfully! We'll notify you when the price drops to ₹${targetPrice.toLocaleString()} or below.`,
    })
  } catch (error) {
    console.error("Error creating price alert:", error)
    return NextResponse.json({ error: "Failed to create price alert" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
  }

  try {
    // Filter alerts by email
    const userAlerts = priceAlerts.filter((alert) => alert.email === email && alert.isActive)

    return NextResponse.json({
      alerts: userAlerts,
      total: userAlerts.length,
    })
  } catch (error) {
    console.error("Error fetching price alerts:", error)
    return NextResponse.json({ error: "Failed to fetch price alerts" }, { status: 500 })
  }
}
