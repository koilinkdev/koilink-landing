"use client"

import { requestWithAuth } from "./api-client"

export type QuotaUsage = {
  used: number
  limit: number
  remaining: number | "unlimited"
  unlimited: boolean
  /**
   * False when the plan does not include the feature at all (limit 0), as opposed
   * to `remaining: 0`, which means today's allowance is spent. The first should
   * show a paywall, the second a reset time.
   */
  available: boolean
}

export type PlanFeatureFlags = {
  unlimitedSwipes: boolean
  rewindEnabled: boolean
  seeWhoLikesYou: boolean
  priorityMatching: boolean
  verifiedBadge: boolean
  advancedFilters: boolean
  analyticsAccess: boolean
}

export type MyLimits = {
  currentPlan: {
    name?: string
    displayName?: string
    tier?: string
  }
  usage: {
    swipes: QuotaUsage
    rewinds: QuotaUsage
  }
  features: PlanFeatureFlags
}

export type ComparablePlan = {
  _id: string
  name: string
  displayName: string
  /** Needed to open a checkout session for the plan. */
  stripePriceId?: string
  tier: "free" | "basic" | "premium" | "enterprise"
  price: number
  currency: string
  interval: "month" | "year"
  description?: string
  benefits?: string[]
  displayOrder?: number
  features?: Partial<PlanFeatureFlags>
  limits?: {
    dailySwipes?: number
    monthlyMatches?: number
    messageCharacterLimit?: number
  }
}

export type ComparePlansResponse = {
  plans: ComparablePlan[]
  currentPlan: { id: string; tier: string } | null
}

/** The client's entitlement source of truth. */
export async function getMyLimitsApi() {
  return requestWithAuth<MyLimits>("/subscriptions/limits")
}

export async function comparePlansApi() {
  return requestWithAuth<ComparePlansResponse>("/subscriptions/compare-plans")
}

export type CheckoutSession = {
  id: string
  url: string | null
  plan?: {
    name: string
    displayName: string
    price: number
  }
}

// This endpoint answers with a bare body rather than the { success, data }
// envelope the rest of the API uses, hence expectEnvelope: false.
export async function createCheckoutSessionApi(priceId: string) {
  return requestWithAuth<CheckoutSession>("/subscriptions/checkout-session", {
    method: "POST",
    expectEnvelope: false,
    body: {
      priceId,
      successUrl: `${window.location.origin}/dashboard/subscription?status=success`,
      cancelUrl: `${window.location.origin}/dashboard/subscription?status=cancelled`,
    },
  })
}
