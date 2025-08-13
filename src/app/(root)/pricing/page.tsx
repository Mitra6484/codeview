"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CheckIcon, SparklesIcon, CrownIcon, AlertTriangleIcon } from "lucide-react"
import { STRIPE_PLANS, isStripeConfigured } from "@/lib/stripe"
import { createCheckoutSession, createPortalSession } from "@/actions/stripe.actions"
import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import toast from "react-hot-toast"
import PageTransition from "@/components/PageTransition"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const { user } = useUser()

  const subscription = useQuery(api.subscriptions.getUserSubscription, {
    userId: user?.id || "",
  })

  const stripeConfigured = isStripeConfigured()

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      toast.error("Please sign in to subscribe")
      return
    }

    if (!stripeConfigured) {
      toast.error("Payment system is not configured")
      return
    }

    if (!priceId) {
      toast.error("Invalid plan selected")
      return
    }

    setIsLoading(priceId)
    try {
      await createCheckoutSession(priceId)
    } catch (error) {
      toast.error("Failed to start checkout process")
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    if (!user) return

    if (!stripeConfigured) {
      toast.error("Payment system is not configured")
      return
    }

    setIsLoading("portal")
    try {
      await createPortalSession()
    } catch (error) {
      toast.error("Failed to open billing portal")
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  const isSubscribed = subscription?.status === "active"
  const isPremium =
    isSubscribed &&
    (subscription?.stripePriceId === STRIPE_PLANS.PREMIUM_MONTHLY.priceId ||
      subscription?.stripePriceId === STRIPE_PLANS.PREMIUM_YEARLY.priceId)

  return (
    <PageTransition>
      <div className="container mx-auto py-10">
        <BreadcrumbNav items={[{ label: "Pricing" }]} className="mb-4" />

        {!stripeConfigured && (
          <Alert className="mb-6">
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              Payment system is not fully configured. Please contact support to enable subscriptions.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock the full potential of technical interviews with AI-powered analysis
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-semibold" : "text-muted-foreground"}`}>Yearly</span>
            <Badge variant="secondary" className="ml-2">
              Save 17%
            </Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-500" />
                <CardTitle>{STRIPE_PLANS.FREE.name}</CardTitle>
              </div>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">
                ${STRIPE_PLANS.FREE.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {STRIPE_PLANS.FREE.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-transparent" variant="outline" disabled={!isSubscribed}>
                {!isSubscribed ? "Current Plan" : "Downgrade"}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Monthly Plan */}
          <Card className={`relative ${!isYearly ? "border-primary shadow-lg scale-105" : ""}`}>
            {!isYearly && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <CrownIcon className="h-5 w-5 text-yellow-500" />
                <CardTitle>Premium Monthly</CardTitle>
              </div>
              <CardDescription>Advanced features for professionals</CardDescription>
              <div className="text-3xl font-bold">
                ${STRIPE_PLANS.PREMIUM_MONTHLY.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {STRIPE_PLANS.PREMIUM_MONTHLY.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPremium && subscription?.stripePriceId === STRIPE_PLANS.PREMIUM_MONTHLY.priceId ? (
                <Button
                  className="w-full"
                  onClick={handleManageSubscription}
                  disabled={isLoading === "portal" || !stripeConfigured}
                >
                  {isLoading === "portal" ? "Loading..." : "Manage Subscription"}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(STRIPE_PLANS.PREMIUM_MONTHLY.priceId!, "Premium Monthly")}
                  disabled={
                    isLoading === STRIPE_PLANS.PREMIUM_MONTHLY.priceId ||
                    !stripeConfigured ||
                    !STRIPE_PLANS.PREMIUM_MONTHLY.priceId ||
                    isYearly
                  }
                  variant={isYearly ? "outline" : "default"}
                >
                  {isLoading === STRIPE_PLANS.PREMIUM_MONTHLY.priceId ? "Loading..." : "Subscribe"}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Premium Yearly Plan */}
          <Card className={`relative ${isYearly ? "border-primary shadow-lg scale-105" : ""}`}>
            {isYearly && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Best Value</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2">
                <CrownIcon className="h-5 w-5 text-yellow-500" />
                <CardTitle>Premium Yearly</CardTitle>
              </div>
              <CardDescription>Best value for committed users</CardDescription>
              <div className="text-3xl font-bold">
                ${STRIPE_PLANS.PREMIUM_YEARLY.price}
                <span className="text-sm font-normal text-muted-foreground">/year</span>
              </div>
              <div className="text-sm text-green-600 font-medium">Save $20 compared to monthly</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {STRIPE_PLANS.PREMIUM_YEARLY.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPremium && subscription?.stripePriceId === STRIPE_PLANS.PREMIUM_YEARLY.priceId ? (
                <Button
                  className="w-full"
                  onClick={handleManageSubscription}
                  disabled={isLoading === "portal" || !stripeConfigured}
                >
                  {isLoading === "portal" ? "Loading..." : "Manage Subscription"}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(STRIPE_PLANS.PREMIUM_YEARLY.priceId!, "Premium Yearly")}
                  disabled={
                    isLoading === STRIPE_PLANS.PREMIUM_YEARLY.priceId ||
                    !stripeConfigured ||
                    !STRIPE_PLANS.PREMIUM_YEARLY.priceId ||
                    !isYearly
                  }
                  variant={!isYearly ? "outline" : "default"}
                >
                  {isLoading === STRIPE_PLANS.PREMIUM_YEARLY.priceId ? "Loading..." : "Subscribe"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">All plans include a 14-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </PageTransition>
  )
}
