"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PriceHistoryChartProps {
  productId: string
}

// Mock price history data
const mockPriceHistory = [
  { date: "2024-01-01", amazon: 149900, flipkart: 152900, relianceDigital: 154900 },
  { date: "2024-01-15", amazon: 147900, flipkart: 149900, relianceDigital: 152900 },
  { date: "2024-02-01", amazon: 144900, flipkart: 147900, relianceDigital: 149900 },
  { date: "2024-02-15", amazon: 139900, flipkart: 142900, relianceDigital: 147900 },
  { date: "2024-03-01", amazon: 134900, flipkart: 139900, relianceDigital: 142900 },
]

export function PriceHistoryChart({ productId }: PriceHistoryChartProps) {
  const formatPrice = (value: number) => `₹${(value / 1000).toFixed(0)}k`
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }

  return (
    <div className="h-64 w-full">
      <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Price History (Last 3 Months)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockPriceHistory}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" tickFormatter={formatDate} className="text-xs" />
          <YAxis tickFormatter={formatPrice} className="text-xs" />
          <Tooltip
            formatter={(value: number, name: string) => [formatPrice(value), name]}
            labelFormatter={(label) => formatDate(label)}
          />
          <Line type="monotone" dataKey="amazon" stroke="#FF9900" strokeWidth={2} name="Amazon" />
          <Line type="monotone" dataKey="flipkart" stroke="#047BD6" strokeWidth={2} name="Flipkart" />
          <Line type="monotone" dataKey="relianceDigital" stroke="#E42529" strokeWidth={2} name="Reliance Digital" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">💡 Lowest in 30 days: ₹134,900 on Amazon</div>
    </div>
  )
}
