import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    api: true,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  }

  try {
    // Basic health check
    const allHealthy = checks.api

    return NextResponse.json(
      {
        status: allHealthy ? "healthy" : "degraded",
        checks,
        message: "DealSense API is running",
      },
      { status: allHealthy ? 200 : 503 },
    )
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        checks: { ...checks, api: false },
        error: "Health check failed",
      },
      { status: 503 },
    )
  }
}
