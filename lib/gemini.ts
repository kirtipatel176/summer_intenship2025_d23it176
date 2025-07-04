import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required")
}

const genAI = new GoogleGenerativeAI(apiKey)

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  },
})

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Gemini AI Error:", error)
    throw new Error("Failed to generate AI response")
  }
}

export async function generateProductRecommendations(
  productName: string,
  currentPrices: { platform: string; price: number }[],
  priceHistory?: { date: string; price: number }[],
) {
  const lowestPrice = Math.min(...currentPrices.map((p) => p.price))
  const highestPrice = Math.max(...currentPrices.map((p) => p.price))
  const bestPlatform = currentPrices.find((p) => p.price === lowestPrice)?.platform

  const prompt = `
As an AI shopping assistant for DealSense, analyze this product and provide recommendations:

Product: ${productName}
Current Prices: ${currentPrices.map((p) => `${p.platform}: ₹${p.price.toLocaleString()}`).join(", ")}
Best Deal: ${bestPlatform} at ₹${lowestPrice.toLocaleString()}
Price Range: ₹${lowestPrice.toLocaleString()} - ₹${highestPrice.toLocaleString()}

${
  priceHistory
    ? `Recent Price Trend: ${priceHistory
        .slice(-5)
        .map((h) => `${h.date}: ₹${h.price.toLocaleString()}`)
        .join(", ")}`
    : ""
}

Provide a JSON response with:
1. recommendation: "buy_now", "wait", or "alternative"
2. confidence: number (0-100)
3. title: brief recommendation title
4. description: 1-2 sentence explanation
5. reasoning: array of 2-3 bullet points explaining the recommendation
6. bestPlatform: platform with best current deal
7. estimatedSavings: potential savings amount if applicable

Focus on Indian market conditions, festival seasons, and typical price patterns.
`

  try {
    const response = await generateAIResponse(prompt)
    // Parse JSON response from Gemini
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback if JSON parsing fails
    return {
      recommendation: "buy_now",
      confidence: 75,
      title: "Good time to buy",
      description: `${bestPlatform} offers the best current price at ₹${lowestPrice.toLocaleString()}.`,
      reasoning: [
        "Competitive pricing across platforms",
        "Good value for the features offered",
        "Stable price trend observed",
      ],
      bestPlatform,
      estimatedSavings: highestPrice - lowestPrice,
    }
  } catch (error) {
    console.error("Error generating product recommendations:", error)
    throw error
  }
}

export async function generateChatResponse(
  message: string,
  conversationHistory: { role: string; content: string }[] = [],
) {
  const context = conversationHistory
    .slice(-6) // Keep last 6 messages for context
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n")

  const prompt = `
You are DealSense AI, a helpful shopping assistant for Indian consumers. You help with:
- Product recommendations and comparisons
- Price analysis and deal evaluation  
- Shopping timing advice (festivals, sales seasons)
- Platform comparisons (Amazon, Flipkart, Reliance Digital)
- Budget-friendly alternatives

Previous conversation:
${context}

User: ${message}

Provide helpful, accurate advice about shopping in India. Be conversational but informative. 
If asked about specific products, mention checking current prices on DealSense.
Keep responses concise (2-3 sentences max) unless detailed comparison is requested.
`

  return await generateAIResponse(prompt)
}
