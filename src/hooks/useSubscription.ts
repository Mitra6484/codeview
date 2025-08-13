"use client"

import { useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { api } from "../../convex/_generated/api"
import { STRIPE_PLANS } from "@/lib/stripe"

export function useSubscription() {
  const { user } = useUser()

  const subscription = useQuery(api.subscriptions.getUserSubscription, {
    userId: user?.id || "",
  })

  const isLoading = subscription === undefined
  const isSubscribed = subscription?.status === "active"
  const isPremium =
    isSubscribed &&
    (subscription?.stripePriceId === STRIPE_PLANS.PREMIUM_MONTHLY.priceId ||
      subscription?.stripePriceId === STRIPE_PLANS.PREMIUM_YEARLY.priceId)

  return {
    subscription,
    isLoading,
    isSubscribed,
    isPremium,
    isFreeTier: !isPremium,
  }
}
