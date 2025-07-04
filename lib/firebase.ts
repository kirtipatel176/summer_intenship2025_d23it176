import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Firebase Database Operations
export async function searchProducts(params: {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  const productsRef = collection(db, "products")
  let q = query(productsRef, where("isActive", "==", true))

  if (params.category) {
    q = query(q, where("category", "==", params.category))
  }

  // Apply sorting
  switch (params.sort) {
    case "price-low":
      q = query(q, orderBy("lowestPrice", "asc"))
      break
    case "price-high":
      q = query(q, orderBy("lowestPrice", "desc"))
      break
    case "rating":
      q = query(q, orderBy("rating", "desc"))
      break
    default:
      q = query(q, orderBy("createdAt", "desc"))
  }

  if (params.limit) {
    q = query(q, limit(params.limit))
  }

  const querySnapshot = await getDocs(q)
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  // Filter by query text (Firebase doesn't support full-text search natively)
  if (params.query) {
    const searchTerm = params.query.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.brand?.toLowerCase().includes(searchTerm),
    )
  }

  return products
}

export async function getProductById(id: string) {
  const docRef = doc(db, "products", id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  }

  return null
}

export async function getPriceHistory(productId: string, days = 90) {
  const historyRef = collection(db, "priceHistory")
  const startDate = Timestamp.fromDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000))

  const q = query(
    historyRef,
    where("productId", "==", productId),
    where("recordedAt", ">=", startDate),
    orderBy("recordedAt", "asc"),
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export async function createPriceAlert(alert: {
  userId: string
  productId: string
  platformId?: string
  targetPrice: number
  email: string
}) {
  const alertsRef = collection(db, "priceAlerts")

  const newAlert = {
    ...alert,
    isActive: true,
    createdAt: serverTimestamp(),
    triggeredAt: null,
  }

  const docRef = await addDoc(alertsRef, newAlert)
  return { id: docRef.id, ...newAlert }
}

export async function createUser(email: string, name?: string) {
  const usersRef = collection(db, "users")

  // Check if user exists
  const q = query(usersRef, where("email", "==", email))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const existingUser = querySnapshot.docs[0]
    return { id: existingUser.id, ...existingUser.data() }
  }

  // Create new user
  const newUser = {
    email,
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }

  const docRef = await addDoc(usersRef, newUser)
  return { id: docRef.id, ...newUser }
}
