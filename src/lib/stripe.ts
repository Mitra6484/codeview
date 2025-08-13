import Stripe from "stripe"

// Check if we're in a server environment and have the required environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey && typeof window === "undefined") {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe functionality will be disabled.")
}

// ... existing code ...
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    })
  : null
// ... existing code ...

export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Basic video interviews",
      "Screen sharing",
      "Recording capabilities",
      "Basic code editor",
      "Up to 5 interviews per month",
    ],
  },
  PREMIUM_MONTHLY: {
    name: "Premium Monthly",
    price: 10,
    priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || null,
    interval: "month",
    features: [
      "Everything in Free",
      "AI Code Analysis",
      "Plagiarism Detection",
      "Unlimited interviews",
      "Advanced analytics",
      "Priority support",
    ],
  },
  PREMIUM_YEARLY: {
    name: "Premium Yearly",
    price: 100,
    priceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || null,
    interval: "year",
    features: ["Everything in Premium Monthly", "2 months free", "Advanced reporting", "Custom integrations"],
  },
} as const

// Helper function to check if Stripe is configured
export const isStripeConfigured = () => {
  return !!(
    stripeSecretKey &&
    process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID &&
    process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
  )
}
