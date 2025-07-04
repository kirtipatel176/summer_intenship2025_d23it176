// MongoDB setup script
// Run this in MongoDB Compass or mongosh

const database = db.getSiblingDB("dealsense")

// Create collections with validation
database.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "platforms", "isActive"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        category: { bsonType: "string" },
        imageUrl: { bsonType: "string" },
        brand: { bsonType: "string" },
        model: { bsonType: "string" },
        rating: { bsonType: "double", minimum: 0, maximum: 5 },
        reviewCount: { bsonType: "int", minimum: 0 },
        isActive: { bsonType: "bool" },
        platforms: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name", "price", "url", "inStock"],
            properties: {
              name: { bsonType: "string" },
              price: { bsonType: "double", minimum: 0 },
              originalPrice: { bsonType: "double", minimum: 0 },
              url: { bsonType: "string" },
              inStock: { bsonType: "bool" },
            },
          },
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
})

// Create indexes
database.products.createIndex({ name: "text", description: "text", brand: "text" })
database.products.createIndex({ category: 1 })
database.products.createIndex({ brand: 1 })
database.products.createIndex({ "platforms.price": 1 })
database.products.createIndex({ rating: -1 })
database.products.createIndex({ createdAt: -1 })

// Create other collections
database.createCollection("users")
database.users.createIndex({ email: 1 }, { unique: true })

database.createCollection("priceHistory")
database.priceHistory.createIndex({ productId: 1, recordedAt: -1 })

database.createCollection("priceAlerts")
database.priceAlerts.createIndex({ userId: 1 })
database.priceAlerts.createIndex({ productId: 1 })
database.priceAlerts.createIndex({ isActive: 1 })

// Insert sample data
database.products.insertMany([
  {
    _id: "iphone-15-pro",
    name: "iPhone 15 Pro 128GB",
    description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system",
    category: "Smartphones",
    imageUrl: "/placeholder.svg?height=300&width=300",
    brand: "Apple",
    model: "iPhone 15 Pro",
    rating: 4.5,
    reviewCount: 1250,
    isActive: true,
    platforms: [
      {
        name: "Amazon",
        price: 134900,
        originalPrice: 149900,
        url: "https://amazon.in/dp/iphone15pro",
        inStock: true,
      },
      {
        name: "Flipkart",
        price: 139900,
        originalPrice: 149900,
        url: "https://flipkart.com/iphone-15-pro",
        inStock: true,
      },
      {
        name: "Reliance Digital",
        price: 142900,
        originalPrice: 149900,
        url: "https://reliancedigital.in/iphone-15-pro",
        inStock: false,
      },
    ],
    lowestPrice: 134900,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    description: "Premium Android smartphone with S Pen, 200MP camera, AI features",
    category: "Smartphones",
    imageUrl: "/placeholder.svg?height=300&width=300",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    rating: 4.3,
    reviewCount: 890,
    isActive: true,
    platforms: [
      {
        name: "Amazon",
        price: 124999,
        originalPrice: 139999,
        url: "https://amazon.in/dp/galaxys24ultra",
        inStock: true,
      },
      {
        name: "Flipkart",
        price: 119999,
        originalPrice: 139999,
        url: "https://flipkart.com/samsung-galaxy-s24-ultra",
        inStock: true,
      },
      {
        name: "Reliance Digital",
        price: 129999,
        originalPrice: 139999,
        url: "https://reliancedigital.in/samsung-galaxy-s24-ultra",
        inStock: true,
      },
    ],
    lowestPrice: 119999,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
])

// Insert sample price history
database.priceHistory.insertMany([
  {
    productId: "iphone-15-pro",
    platform: "Amazon",
    price: 149900,
    originalPrice: 149900,
    recordedAt: new Date("2024-01-01"),
  },
  {
    productId: "iphone-15-pro",
    platform: "Amazon",
    price: 134900,
    originalPrice: 149900,
    recordedAt: new Date("2024-03-01"),
  },
])

print("MongoDB setup completed successfully!")
