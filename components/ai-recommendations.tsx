"use client"

import { useState, useEffect } from "react"
import { Brain, TrendingUp, Clock, CheckCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AIRecommendationsProps {
  query: string
}

interface AIRecommendation {
  type: "buy_now" | "wait" | "alternative"
  title: string
  description: string
  confidence: number
  reasoning: string[]
  bestPlatform?: string
  estimatedSavings?: number
}

export function AIRecommendations({ query }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!query) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/ai/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        })

        if (!response.ok) {
          throw new Error("Failed to get AI recommendations")
        }

        const data = await response.json()
        setRecommendations(data.recommendations || [])
      } catch (err) {
        console.error("Error fetching AI recommendations:", err)
        setError("Unable to load AI recommendations")

        // Fallback recommendations
        setRecommendations([
          {
            type: "buy_now",
            title: "Good time to buy!",
            description: "Current prices are competitive across platforms.",
            confidence: 75,
            reasoning: [
              "Stable pricing trends observed",
              "Good availability across platforms",
              "No major sales events expected soon",
            ],
            bestPlatform: "Amazon",
            estimatedSavings: 5000,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [query])

  if (!query) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Shopping Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Search for a product to get AI-powered recommendations and insights.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Shopping Assistant
            <Badge variant="secondary" className="ml-auto">
              Powered by Gemini
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Analyzing products and market trends...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Shopping Assistant
          <Badge variant="secondary" className="ml-auto">
            Powered by Gemini
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">{error}</p>
          </div>
        )}

        {recommendations.map((rec, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {rec.type === "buy_now" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {rec.type === "wait" && <Clock className="w-5 h-5 text-orange-600" />}
                {rec.type === "alternative" && <TrendingUp className="w-5 h-5 text-blue-600" />}
                <h3 className="font-semibold">{rec.title}</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {rec.confidence}% confident
              </Badge>
            </div>

            <p className="text-gray-600 dark:text-gray-400">{rec.description}</p>

            {rec.bestPlatform && (
              <p className="text-sm text-green-600 dark:text-green-400">
                💡 Best deal found on {rec.bestPlatform}
                {rec.estimatedSavings && ` - Save up to ₹${rec.estimatedSavings.toLocaleString()}`}
              </p>
            )}

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Reasoning:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {rec.reasoning.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          Ask AI Assistant a Question
        </Button>
      </CardContent>
    </Card>
  )
}
