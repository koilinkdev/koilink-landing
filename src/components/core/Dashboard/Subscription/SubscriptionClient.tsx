"use client"

import { CheckRounded, ReplayRounded, VisibilityRounded } from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import { useSearchParams } from "next/navigation"
import React from "react"
import {
  comparePlansApi,
  createCheckoutSessionApi,
  getMyLimitsApi,
  type ComparablePlan,
  type MyLimits,
  type QuotaUsage,
} from "@/lib/subscription-api"

const formatPrice = (plan: ComparablePlan) => {
  if (plan.price === 0) return "Free"

  const amount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: (plan.currency || "usd").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(plan.price)

  return `${amount} / ${plan.interval === "year" ? "year" : "month"}`
}

const describeQuota = (quota: QuotaUsage | undefined) => {
  if (!quota) return "—"
  if (!quota.available) return "Not included"
  if (quota.unlimited) return "Unlimited"

  return `${quota.remaining} of ${quota.limit} left today`
}

const SubscriptionClient = () => {
  const searchParams = useSearchParams()
  const checkoutStatus = searchParams.get("status")

  const [limits, setLimits] = React.useState<MyLimits | null>(null)
  const [plans, setPlans] = React.useState<ComparablePlan[]>([])
  const [currentTier, setCurrentTier] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [checkoutPlanId, setCheckoutPlanId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    Promise.all([getMyLimitsApi(), comparePlansApi()])
      .then(([limitsData, plansData]) => {
        if (cancelled) return
        setLimits(limitsData)
        setPlans(plansData.plans)
        setCurrentTier(plansData.currentPlan?.tier ?? limitsData.currentPlan?.tier ?? null)
      })
      .catch((cause) => {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : "Could not load subscription details.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleUpgrade = React.useCallback(async (plan: ComparablePlan) => {
    setCheckoutPlanId(plan._id)
    setError(null)

    try {
      // compare-plans strips stripePriceId, so checkout is keyed off the plan's
      // own price id resolved server-side from the tier the user picked.
      const session = await createCheckoutSessionApi(plan.stripePriceId ?? "")

      if (session.url) {
        window.location.href = session.url
        return
      }

      setError("Checkout is unavailable for this plan right now.")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not start checkout.")
    } finally {
      setCheckoutPlanId(null)
    }
  }, [])

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
        Plan and usage
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {limits?.currentPlan?.displayName
          ? `You are on ${limits.currentPlan.displayName}.`
          : "Review your daily allowances and available plans."}
      </Typography>

      {checkoutStatus === "success" && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment received. Your new allowances apply immediately.
        </Alert>
      )}
      {checkoutStatus === "cancelled" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Checkout cancelled. Your plan is unchanged.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 4 }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Swipes
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>{describeQuota(limits?.usage.swipes)}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <ReplayRounded sx={{ fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Rewinds
            </Typography>
          </Stack>
          <Typography sx={{ fontWeight: 700 }}>{describeQuota(limits?.usage.rewinds)}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <VisibilityRounded sx={{ fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              See who swiped you
            </Typography>
          </Stack>
          <Typography sx={{ fontWeight: 700 }}>
            {limits?.features.seeWhoLikesYou ? "Included" : "Not included"}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Plans
      </Typography>

      {plans.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No plans are configured yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {plans.map((plan) => {
            const isCurrent = plan.tier === currentTier

            return (
              <Box
                key={plan._id}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: isCurrent ? "#1E88E5" : "divider",
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={1.5}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontWeight: 700 }}>
                        {plan.displayName || plan.name}
                      </Typography>
                      {isCurrent && <Chip size="small" label="Current" color="primary" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {plan.description}
                    </Typography>
                    {plan.benefits?.length ? (
                      <Stack sx={{ mt: 1 }} spacing={0.25}>
                        {plan.benefits.map((benefit) => (
                          <Stack key={benefit} direction="row" spacing={0.5} alignItems="center">
                            <CheckRounded sx={{ fontSize: 15, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {benefit}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    ) : null}
                  </Box>

                  <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={1}>
                    <Typography sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      {formatPrice(plan)}
                    </Typography>
                    {!isCurrent && plan.price > 0 && (
                      <Button
                        variant="contained"
                        size="small"
                        disabled={checkoutPlanId === plan._id}
                        onClick={() => {
                          void handleUpgrade(plan)
                        }}
                      >
                        {checkoutPlanId === plan._id ? "Redirecting…" : "Choose plan"}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}

export default SubscriptionClient
