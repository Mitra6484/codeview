"use server"

import { stripe, isStripeConfigured } from "@/lib/stripe"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function createCheckoutSession(priceId: string) {
  if (!isStripeConfigured() || !stripe) {
    throw new Error("Stripe is not configured properly")
  }

  const user = await currentUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  if (!priceId) {
    throw new Error("Price ID is required")
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    })

    if (session.url) {
      redirect(session.url)
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw new Error("Failed to create checkout session")
  }
}

export async function createPortalSession() {
  if (!isStripeConfigured() || !stripe) {
    throw new Error("Stripe is not configured properly")
  }

  const user = await currentUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  try {
    // First, find the customer by email
    const customers = await stripe.customers.list({
      email: user.emailAddresses[0].emailAddress,
      limit: 1,
    })

    if (customers.data.length === 0) {
      throw new Error("No subscription found")
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
    })

    if (session.url) {
      redirect(session.url)
    }
  } catch (error) {
    console.error("Error creating portal session:", error)
    throw new Error("Failed to create portal session")
  }
}
