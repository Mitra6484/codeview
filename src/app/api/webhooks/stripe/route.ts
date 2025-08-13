import { stripe, isStripeConfigured } from "@/lib/stripe"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  if (!isStripeConfigured() || !stripe) {
    console.error("Stripe is not configured properly")
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    console.error(`Webhook signature verification failed:`, error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription

        // Update user subscription status in your database
        // You'll need to implement this based on your database structure
        console.log("Subscription updated:", subscription.id)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        // Handle subscription cancellation
        console.log("Subscription cancelled:", subscription.id)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        // Handle successful payment
        console.log("Payment succeeded:", invoice.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice

        // Handle failed payment
        console.log("Payment failed:", invoice.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
