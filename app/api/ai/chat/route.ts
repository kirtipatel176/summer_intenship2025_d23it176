import { type NextRequest, NextResponse } from "next/server"
import { generateChatResponse } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate AI response using Gemini
    const response = await generateChatResponse(message, conversationHistory || [])

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI chat:", error)

    // Return appropriate error message
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: "AI service is not configured. Please check API keys." }, { status: 503 })
    }

    return NextResponse.json({ error: "Failed to get AI response. Please try again." }, { status: 500 })
  }
}
