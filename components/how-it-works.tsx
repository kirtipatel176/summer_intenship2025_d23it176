import { Search, Brain, Bell, ShoppingCart } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search Products",
      description: "Search for any product using our smart search with autocomplete suggestions",
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI analyzes prices, reviews, and market trends to give you insights",
    },
    {
      icon: Bell,
      title: "Set Alerts",
      description: "Get notified when prices drop below your target price",
    },
    {
      icon: ShoppingCart,
      title: "Buy Smart",
      description: "Purchase from the platform with the best deal at the right time",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How DealSense Works</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform makes smart shopping simple and saves you money
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
